import React, { useState, useEffect } from "react";
import { StyleSheet, Dimensions, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { PieChart } from "react-native-chart-kit";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Image } from "react-native";

export default function TabThreeScreen() {
  const [selectedValue, setSelectedValue] = useState("0");
  const [chart1Data, setChart1Data] = useState([]);
  const [chart0Data, setChart0Data] = useState([]);

  const data = [
    { label: "Todos os Campi", value: "0" },
    { label: "Campina Verde", value: "3" },
    { label: "Ituiutaba", value: "4" },
    { label: "Paracatu", value: "5" },
    { label: "Patos de Minas", value: "6" },
    { label: "Patrocínio", value: "7" },
    { label: "Uberaba", value: "2" },
    { label: "Uberaba Parque Tecnológico", value: "1" },
    { label: "Uberlândia", value: "8" },
    { label: "Uberlândia Centro", value: "9" },
  ];
  const imageUrl = require("../../assets/images/obs.png");
  const menuImage = require("../../assets/images/menu.png");

  useEffect(() => {
    fetchData();
  }, [selectedValue]);

  const fetchData = async () => {
    try {
      const response1 = await fetch(
        `https://obsiftm.midi.upt.iftm.edu.br/api/Pesquisadores/Titularidade?QualInstituicao=${selectedValue}`
      );
      const fetchedData1 = await response1.json();
      setChart1Data(processChartData(fetchedData1));
    } catch (error) {
      console.error("Erro na requisição da API 1");
    }

    try {
      const response0 = await fetch(
        `https://obsiftm.midi.upt.iftm.edu.br/api/Pesquisadores/UltimaAtualizacaoLattes?QualInstituicao=${selectedValue}`
      );
      const fetchedData0 = await response0.json();
      setChart0Data(processChartData(fetchedData0));
    } catch (error) {
      console.error("Erro na requisição da API 0");
    }
  };

  const processChartData = (data: any) => {
    const total = data.reduce((sum: number, item: any) => sum + item.qtde, 0);
    return data.map((item: any, index: any) => ({
      ...item,
      color: getColor(index),
      legendFontColor: "#ccc",
      legendFontSize: 8,
      legendPosition: "bottom",
      name: `- ${item.value} (${((item.qtde / total) * 100).toFixed(1)}%)`,
    }));
  };

  const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#DC143C",
    "#00FFFF",
    "#008B8B",
    "#B8860B",
  ];

  const getColor = (index: any) => {
    return colors[index % colors.length];
  };

  const chartConfig = {
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <ThemedView style={styles.fullContainer}>
        <ThemedView style={styles.navbarContainer}>
          <Image source={menuImage} style={styles.image} />

          <ThemedText style={styles.navbar}>Observatório IFTM</ThemedText>
          <Image source={imageUrl} style={styles.image} />
        </ThemedView>
        <ThemedView style={styles.container}>
          <ThemedText style={styles.titleText}>Escolha o Campus:</ThemedText>
          <ThemedView style={styles.selectView}>
            <Picker
              selectedValue={selectedValue}
              onValueChange={(itemValue) => setSelectedValue(itemValue)}
              mode="dialog"
            >
              {data.map((item) => (
                <Picker.Item
                  key={item.value}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </Picker>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.chartView}>
          <ThemedView style={styles.pieChartContainer}>
            <ThemedText style={styles.subtitleText}>
              Última atualização do Lattes
            </ThemedText>
            <PieChart
              data={chart0Data}
              width={Dimensions.get("window").width}
              height={240}
              chartConfig={chartConfig}
              accessor="qtde"
              backgroundColor="transparent"
              paddingLeft={"-8"}
              center={[15, 0]}
              absolute
            />
          </ThemedView>
          <ThemedView style={styles.pieChartContainer}>
            <ThemedText style={styles.subtitleText}>Titularidade</ThemedText>
            <PieChart
              data={chart1Data}
              width={Dimensions.get("window").width}
              height={240}
              chartConfig={chartConfig}
              accessor="qtde"
              backgroundColor="transparent"
              paddingLeft={"-8"}
              center={[15, 0]}
              absolute
            />
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  navbarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 100,
    paddingTop: 50,
    shadowColor: "gray",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4.84,
    elevation: 20,
    paddingVertical: 10,
  },
  navbar: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
  },
  fullContainer: {
    flex: 1,
    width: "100%",
    height: "auto",
  },
  scrollView: {
    flexGrow: 1,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  chartView: {
    width: "100%",
    margin: "auto",
    marginTop: 20,
  },
  pieChartContainer: {
    width: Dimensions.get("window").width - 40,
    alignSelf: "center",
  },
  container: {
    flex: 1,
    margin: "auto",
    marginTop: 50,
  },
  selectView: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    width: Dimensions.get("window").width - 40,
    borderRadius: 16,
    alignSelf: "center",
  },
  subtitleText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    margin: 5,
  },
  image: {
    marginHorizontal: 20,
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
});
