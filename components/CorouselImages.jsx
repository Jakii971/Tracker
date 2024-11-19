import * as React from "react";
import { Dimensions, View, Image } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const CorouselImages = ({images}) => {
	const width = Dimensions.get("window").width * 0.9;

	return (
		<View className='flex-1'>
			<Carousel
				loop
				width={width}
				height={width / 2}
				autoPlay={true}
				data={images}
				mode="parallax"
				scrollAnimationDuration={1000}
				panGestureHandlerProps={{
					activeOffsetX: [-10, 10],
				}}
				renderItem={({ index }) => (
					<View className="flex-1 justify-center">
						<Image source={{ uri: images[index] }} resizeMode="contain" className="w-full h-full"/>
					</View>
				)}
			/>
		</View>
	);
};

export default CorouselImages;
