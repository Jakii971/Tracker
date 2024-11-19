import React, { useEffect } from "react";
import { SafeAreaView, Dimensions, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const MyLineChart = ({ monthlyData }) => {
	const allMonths = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	// Map monthlyData to an object for quick lookup
	const monthlyDataMap = monthlyData.reduce((acc, item) => {
		const monthIndex = new Date(item.month).getMonth();
		acc[monthIndex] = item.totalScores;
		return acc;
	}, {});

	const labels = allMonths;
	const scoresData = labels.map((label, index) => monthlyDataMap[index] || 0); // Use 0 if no data for the month
	const chartWidth = labels.length * 55;

	useEffect(() => {
		// console.log("Monthly Data:", monthlyData);
		// console.log("Scores Data:", scoresData);
	});

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
				<LineChart
					className="my-1"
					data={{
						labels: labels,
						datasets: [
							{
								data: scoresData,
								strokeWidth: 2,
							},
						],
					}}
					width={chartWidth}
					height={220}
					chartConfig={{
						backgroundGradientFrom: "#efefef",
						backgroundGradientTo: "#efefef",
						decimalPlaces: 1,
						color: (opacity = 1) => `rgba(252, 211, 77, ${opacity})`,
						labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
						propsForDots: { r: "5", strokeWidth: "1", stroke: "#fcd34d" },
						style: { borderRadius: 16 },
					}}
					bezier
					// style={{ marginVertical: 8, borderRadius: 16, }}
				/>
			</ScrollView>
		</SafeAreaView>
	);
};

export default MyLineChart;
