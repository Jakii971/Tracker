import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { forwardRef } from "react";
import { icons } from "../constants";

const SearchInput = forwardRef(({ placeholder, handlePress, otherStyles, editable, searchKeyword, setSearchKeyword }, ref) => {
	return (
		<TouchableOpacity className={`w-full h-14 border rounded-lg items-center flex-row p-1 ${otherStyles}`} onPress={handlePress}>
			<TextInput
				placeholder={placeholder}
				editable={editable}
				className="px-4 flex-1 text-base font-pregular"
				ref={ref}
				value = {searchKeyword}
				onChange={(e) => setSearchKeyword(e.nativeEvent.text) }
			/>
			<TouchableOpacity
				className="w-12 h-full items-center justify-center bg-secondary rounded-md"
				onPress={handlePress}
			>
				<Image source={icons.search} className="w-7 h-7" resizeMode="contain" />
			</TouchableOpacity>
		</TouchableOpacity>
	);
});

export default SearchInput;
