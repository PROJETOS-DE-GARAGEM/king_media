import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";

// Cache global para dados do usuário
let mediaCache: UserMediaItem[] = [];
let cacheUserId: string | null = null;
let cacheTime: number = 0;
const CACHE_DURATION = 60000; // 1 minuto

export interface UserMediaItem {
  id?: string;
  userId: string;
  mediaId: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath: string | null;
  status: "quero_assistir" | "assistindo" | "assistido" | "pausado";
  rating?: number; // 1-5 estrelas
  review?: string; // Comentário pessoal
  addedAt: Timestamp;
  updatedAt: Timestamp;
  genres: string[];
  listName?: string;
}

export interface EpisodeProgress {
  id?: string;
  userId: string;
  mediaId: number;
  seasonNumber: number;
  episodeNumber: number;
  watched: boolean;
  watchedAt?: Timestamp;
}

export interface SeasonProgress {
  id?: string;
  userId: string;
  mediaId: number;
  seasonNumber: number;
  allWatched: boolean;
  lastWatchedEpisode: number;
}

export interface UserList {
  id?: string;
  userId: string;
  name: string;
  description?: string;
  createdAt: Timestamp;
  isDefault: boolean;
}

// ====== LISTAS DO USUÁRIO ======

export const createUserList = async (
  name: string,
  description?: string
): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const listRef = await addDoc(collection(db, "userLists"), {
      userId: user.uid,
      name,
      description: description || "",
      createdAt: Timestamp.now(),
      isDefault: false,
    });
    return listRef.id;
  } catch (error) {
    console.error("Erro ao criar lista:", error);
    return null;
  }
};

export const getUserLists = async (): Promise<UserList[]> => {
  const user = auth.currentUser;
  if (!user) return [];

  try {
    const q = query(
      collection(db, "userLists"),
      where("userId", "==", user.uid)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as UserList[];
  } catch (error) {
    console.error("Erro ao buscar listas:", error);
    return [];
  }
};

export const deleteUserList = async (listId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, "userLists", listId));
    return true;
  } catch (error) {
    console.error("Erro ao deletar lista:", error);
    return false;
  }
};

// ====== ADICIONAR/REMOVER MÍDIA ======

export const addMediaToList = async (
  mediaData: Omit<UserMediaItem, "id" | "userId" | "addedAt" | "updatedAt">
): Promise<boolean> => {
  const user = auth.currentUser;
  if (!user) return false;

  const startTime = Date.now();
  console.log("⏱️ [ADD] Iniciando...");

  try {
    // Remover campos undefined antes de salvar no Firestore
    const cleanedData = { ...mediaData };
    if (cleanedData.listName === undefined) {
      delete cleanedData.listName;
    }
    if (cleanedData.rating === undefined) {
      delete cleanedData.rating;
    }
    if (cleanedData.review === undefined) {
      delete cleanedData.review;
    }

    const docToAdd = {
      userId: user.uid,
      ...cleanedData,
      addedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    console.log("⏱️ [ADD] Salvando no Firestore...");
    const docRef = await addDoc(collection(db, "userMedia"), docToAdd);
    console.log(`⏱️ [ADD] Salvo! Tempo: ${Date.now() - startTime}ms`);

    // Atualizar cache imediatamente
    if (cacheUserId === user.uid) {
      mediaCache.push({ id: docRef.id, ...docToAdd });
      console.log("⏱️ [ADD] Cache atualizado!");
    }

    console.log(`✅ [ADD] Total: ${Date.now() - startTime}ms`);
    return true;
  } catch (error) {
    console.error("❌ [ADD] Erro:", error);
    console.log(`⏱️ [ADD] Tempo até erro: ${Date.now() - startTime}ms`);
    return false;
  }
};
export const removeMediaFromList = async (
  mediaId: number,
  mediaType: "movie" | "tv"
): Promise<boolean> => {
  const user = auth.currentUser;
  if (!user) return false;

  try {
    // Buscar no cache primeiro
    const cachedItem = mediaCache.find(
      (item) => item.mediaId === mediaId && item.mediaType === mediaType
    );

    if (cachedItem && cachedItem.id) {
      await deleteDoc(doc(db, "userMedia", cachedItem.id));

      // Remover do cache
      mediaCache = mediaCache.filter(
        (item) => !(item.mediaId === mediaId && item.mediaType === mediaType)
      );

      return true;
    }

    // Fallback: buscar no Firestore
    const q = query(
      collection(db, "userMedia"),
      where("userId", "==", user.uid)
    );
    const snapshot = await getDocs(q);

    const found = snapshot.docs.find((doc) => {
      const data = doc.data();
      return data.mediaId === mediaId && data.mediaType === mediaType;
    });

    if (found) {
      await deleteDoc(found.ref);
      mediaCache = mediaCache.filter(
        (item) => !(item.mediaId === mediaId && item.mediaType === mediaType)
      );
      return true;
    }
    return false;
  } catch (error) {
    console.error("Erro ao remover mídia:", error);
    return false;
  }
};

export const getUserMedia = async (
  status?: string,
  listName?: string,
  forceRefresh: boolean = false
): Promise<UserMediaItem[]> => {
  const user = auth.currentUser;
  if (!user) return [];

  const now = Date.now();
  const startTime = Date.now();

  // Usar cache se disponível e válido
  if (
    !forceRefresh &&
    cacheUserId === user.uid &&
    mediaCache.length > 0 &&
    now - cacheTime < CACHE_DURATION
  ) {
    console.log(
      `⚡ [GET] Usando CACHE! ${mediaCache.length} itens (${
        Date.now() - startTime
      }ms)`
    );
    let items = [...mediaCache];

    // Filtrar no lado do cliente
    if (status) {
      items = items.filter((item) => item.status === status);
    }

    if (listName) {
      items = items.filter((item) => item.listName === listName);
    }

    return items;
  }

  console.log("⏱️ [GET] Cache vazio ou expirado. Buscando do Firestore...");

  try {
    const q = query(
      collection(db, "userMedia"),
      where("userId", "==", user.uid)
    );

    console.log("⏱️ [GET] Executando query...");
    const snapshot = await getDocs(q);
    console.log(
      `⏱️ [GET] Query concluída: ${snapshot.size} docs (${
        Date.now() - startTime
      }ms)`
    );

    let items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as UserMediaItem[];

    // Atualizar cache
    mediaCache = items;
    cacheUserId = user.uid;
    cacheTime = now;
    console.log(`⏱️ [GET] Cache atualizado com ${items.length} itens`);

    // Filtrar no lado do cliente
    if (status) {
      items = items.filter((item) => item.status === status);
    }

    if (listName) {
      items = items.filter((item) => item.listName === listName);
    }

    console.log(`✅ [GET] Total: ${Date.now() - startTime}ms`);
    return items;
  } catch (error) {
    console.error("❌ [GET] Erro:", error);
    console.log(`⏱️ [GET] Tempo até erro: ${Date.now() - startTime}ms`);
    return [];
  }
};
export const checkIfMediaInList = async (
  mediaId: number,
  mediaType: "movie" | "tv"
): Promise<UserMediaItem | null> => {
  const user = auth.currentUser;
  if (!user) return null;

  // Buscar no cache primeiro (instantâneo)
  if (cacheUserId === user.uid && mediaCache.length > 0) {
    const found = mediaCache.find(
      (item) => item.mediaId === mediaId && item.mediaType === mediaType
    );
    if (found) return found;
  }

  try {
    // Fallback: buscar no Firestore
    const q = query(
      collection(db, "userMedia"),
      where("userId", "==", user.uid)
    );
    const snapshot = await getDocs(q);

    const found = snapshot.docs.find((doc) => {
      const data = doc.data();
      return data.mediaId === mediaId && data.mediaType === mediaType;
    });

    if (found) {
      return {
        id: found.id,
        ...found.data(),
      } as UserMediaItem;
    }
    return null;
  } catch (error) {
    console.error("Erro ao verificar mídia:", error);
    return null;
  }
};

// ====== PROGRESSO DE EPISÓDIOS ======

export const markEpisodeAsWatched = async (
  mediaId: number,
  seasonNumber: number,
  episodeNumber: number,
  watched: boolean
): Promise<boolean> => {
  const user = auth.currentUser;
  if (!user) return false;

  try {
    const episodeId = `${user.uid}_${mediaId}_${seasonNumber}_${episodeNumber}`;
    const episodeRef = doc(db, "episodeProgress", episodeId);

    if (watched) {
      await setDoc(episodeRef, {
        userId: user.uid,
        mediaId,
        seasonNumber,
        episodeNumber,
        watched: true,
        watchedAt: Timestamp.now(),
      });
    } else {
      await deleteDoc(episodeRef);
    }
    return true;
  } catch (error) {
    console.error("Erro ao marcar episódio:", error);
    return false;
  }
};

export const markSeasonAsWatched = async (
  mediaId: number,
  seasonNumber: number,
  totalEpisodes: number,
  watched: boolean
): Promise<boolean> => {
  const user = auth.currentUser;
  if (!user) return false;

  try {
    // Marcar todos os episódios da temporada
    const promises = [];
    for (let i = 1; i <= totalEpisodes; i++) {
      promises.push(markEpisodeAsWatched(mediaId, seasonNumber, i, watched));
    }
    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error("Erro ao marcar temporada:", error);
    return false;
  }
};

export const getWatchedEpisodes = async (
  mediaId: number
): Promise<EpisodeProgress[]> => {
  const user = auth.currentUser;
  if (!user) return [];

  try {
    const q = query(
      collection(db, "episodeProgress"),
      where("userId", "==", user.uid),
      where("mediaId", "==", mediaId),
      where("watched", "==", true)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as EpisodeProgress[];
  } catch (error) {
    console.error("Erro ao buscar episódios assistidos:", error);
    return [];
  }
};

export const getSeasonProgress = async (
  mediaId: number,
  seasonNumber: number
): Promise<number[]> => {
  const user = auth.currentUser;
  if (!user) return [];

  try {
    const q = query(
      collection(db, "episodeProgress"),
      where("userId", "==", user.uid),
      where("mediaId", "==", mediaId),
      where("seasonNumber", "==", seasonNumber),
      where("watched", "==", true)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data().episodeNumber as number);
  } catch (error) {
    console.error("Erro ao buscar progresso da temporada:", error);
    return [];
  }
};

// ====== ATUALIZAR STATUS ======

export const updateMediaStatus = async (
  mediaId: number,
  mediaType: "movie" | "tv",
  status: "quero_assistir" | "assistindo" | "assistido" | "pausado"
): Promise<boolean> => {
  const user = auth.currentUser;
  if (!user) return false;

  try {
    // Query otimizada: busca direta com todos os filtros
    const q = query(
      collection(db, "userMedia"),
      where("userId", "==", user.uid),
      where("mediaId", "==", mediaId),
      where("mediaType", "==", mediaType)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docRef = snapshot.docs[0].ref;
      await updateDoc(docRef, {
        status,
        updatedAt: Timestamp.now(),
      });

      // Atualizar cache
      if (cacheUserId === user.uid) {
        const cacheIndex = mediaCache.findIndex(
          (item) => item.mediaId === mediaId && item.mediaType === mediaType
        );
        if (cacheIndex !== -1) {
          mediaCache[cacheIndex].status = status;
        }
      }

      return true;
    }
    return false;
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    return false;
  }
};

// ====== ATUALIZAR AVALIAÇÃO E REVIEW ======

export const updateMediaRating = async (
  mediaId: number,
  mediaType: "movie" | "tv",
  rating: number,
  review?: string
): Promise<boolean> => {
  const user = auth.currentUser;
  if (!user) return false;

  try {
    // Query otimizada: busca direta com todos os filtros
    const q = query(
      collection(db, "userMedia"),
      where("userId", "==", user.uid),
      where("mediaId", "==", mediaId),
      where("mediaType", "==", mediaType)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docRef = snapshot.docs[0].ref;
      const updateData: any = {
        rating,
        updatedAt: Timestamp.now(),
      };

      if (review !== undefined) {
        updateData.review = review;
      }

      await updateDoc(docRef, updateData);

      // Atualizar cache
      if (cacheUserId === user.uid) {
        const cacheIndex = mediaCache.findIndex(
          (item) => item.mediaId === mediaId && item.mediaType === mediaType
        );
        if (cacheIndex !== -1) {
          mediaCache[cacheIndex].rating = rating;
          if (review !== undefined) {
            mediaCache[cacheIndex].review = review;
          }
        }
      }

      return true;
    }
    return false;
  } catch (error) {
    console.error("Erro ao atualizar avaliação:", error);
    return false;
  }
};

// ====== LIMPAR TODOS OS DADOS ======

export const clearAllUserData = async (): Promise<boolean> => {
  const user = auth.currentUser;
  if (!user) return false;

  try {
    console.log("🗑️ Limpando todos os dados do usuário...");

    // Limpar userMedia
    const mediaQuery = query(
      collection(db, "userMedia"),
      where("userId", "==", user.uid)
    );
    const mediaSnapshot = await getDocs(mediaQuery);
    console.log(`🗑️ Encontrados ${mediaSnapshot.size} itens em userMedia`);

    const mediaDeletePromises = mediaSnapshot.docs.map((doc) =>
      deleteDoc(doc.ref)
    );
    await Promise.all(mediaDeletePromises);

    // Limpar episodeProgress
    const episodesQuery = query(
      collection(db, "episodeProgress"),
      where("userId", "==", user.uid)
    );
    const episodesSnapshot = await getDocs(episodesQuery);
    console.log(
      `🗑️ Encontrados ${episodesSnapshot.size} itens em episodeProgress`
    );

    const episodesDeletePromises = episodesSnapshot.docs.map((doc) =>
      deleteDoc(doc.ref)
    );
    await Promise.all(episodesDeletePromises);

    // Limpar userLists
    const listsQuery = query(
      collection(db, "userLists"),
      where("userId", "==", user.uid)
    );
    const listsSnapshot = await getDocs(listsQuery);
    console.log(`🗑️ Encontrados ${listsSnapshot.size} itens em userLists`);

    const listsDeletePromises = listsSnapshot.docs.map((doc) =>
      deleteDoc(doc.ref)
    );
    await Promise.all(listsDeletePromises);

    // Limpar cache
    mediaCache = [];
    cacheUserId = null;
    cacheTime = 0;

    console.log("✅ Todos os dados foram limpos!");
    return true;
  } catch (error) {
    console.error("❌ Erro ao limpar dados:", error);
    return false;
  }
};
