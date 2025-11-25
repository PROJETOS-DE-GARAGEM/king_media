import { themas } from "@/global/themas";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

export default function SelectSimples() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Assistindo!");
  const [checked, setChecked] = React.useState(false);
  const [selecionado, setSelecionado] = React.useState(false)
  return (
    <View style={styles.container}>
      <View style={{ gap: 10 }}>

        <Text style={{ color: "white", fontWeight: "bold" }}>Status</Text>
        <TouchableOpacity onPress={() => setOpen(!open)} style={styles.button}>

          <Text style={styles.textoIcon}> ⟳ {selected} {open ? "▲" : "▼"} </Text>

        </TouchableOpacity>

        {/* Opção (mostra só quando open for true) */}
        {open && (
          <TouchableOpacity onPress={() => {
            setSelected("episodio: 10");
            setOpen(false);
          }} style={styles.caixa}>
            <Text>episodio: 10</Text>
          </TouchableOpacity>
        )}

      </View>
      <View style={{ gap: 10 }}>
        <Text style={{ color: "white" }}>Episodios Assistidos</Text>
        <View style={{ width: "100%", borderBottomWidth: 1, borderBottomColor: themas.colors.Secondary }}></View>
      </View>


      <TouchableOpacity style={styles.check} onPress={()=>{setSelecionado(!selecionado)}}>

        <TouchableOpacity
          onPress={() => setChecked(!checked)}
          style={{
            width: 24,
            height: 24,
            borderRadius: 12, // redondo
            borderWidth: 2,
            borderColor: '#FFA500',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: checked ? '#FFA500' : 'transparent',
            marginRight:10
            }}>
          {checked && (
            <Text style={{ color: 'white', fontWeight: 'bold' }}>✓</Text>
          )}
        </TouchableOpacity>


        <Text style={{ color: "white", marginRight:200 }}> Temporada 1 </Text>
        <Text > {selecionado ? "▼" : "▲"}</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text>+ Adicionar Temporada</Text>
      </TouchableOpacity>



    </View>
  );
}
