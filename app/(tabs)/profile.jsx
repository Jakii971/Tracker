import React, { useState, useEffect, useRef } from "react";
import {
	StyleSheet,
	View,
	Text,
	Dimensions,
	Animated,
	PanResponder,
	Platform,
	TouchableOpacity,
	StatusBar,
	Image,
} from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { icons, images } from "../../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { Rank, Friend, Profile } from "../../components/profileTab";
import { useSelector } from "react-redux";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
const TabBarHeight = 50;
const HeaderHeight = 450;
const SafeStatusBar = Platform.select({
	ios: 44,
	android: StatusBar.currentHeight,
});

const Bio = () => {
	const user = useSelector((state) => state.profile.user);
	/**
	 * stats
	 */
	const [tabIndex, setIndex] = useState(0);
	const [canScroll, setCanScroll] = useState(true);
	const [routes] = useState([
		{ key: "rank", title: "Rank" },
		{ key: "friend", title: "Friend" },
		{ key: "profile", title: "Profile" },
	]);

	/**
	 * ref
	 */
	const scrollY = useRef(new Animated.Value(0)).current;
	const headerScrollY = useRef(new Animated.Value(0)).current;
	const listRefArr = useRef([]);
	const listOffset = useRef({});
	const isListGliding = useRef(false);
	const headerScrollStart = useRef(0);
	const _tabIndex = useRef(0);

	/**
	 * PanResponder for header
	 */
	const headerPanResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
			onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
			onStartShouldSetPanResponder: (evt, gestureState) => {
				headerScrollY.stopAnimation();
				syncScrollOffset();
				return false;
			},

			onMoveShouldSetPanResponder: (evt, gestureState) => {
				headerScrollY.stopAnimation();
				return Math.abs(gestureState.dy) > 5;
			},

			onPanResponderRelease: (evt, gestureState) => {
				syncScrollOffset();
				if (Math.abs(gestureState.vy) < 0.2) {
					return;
				}
				headerScrollY.setValue(scrollY._value);
				Animated.decay(headerScrollY, {
					velocity: -gestureState.vy,
					useNativeDriver: true,
				}).start(() => {
					syncScrollOffset();
				});
			},
			onPanResponderMove: (evt, gestureState) => {
				listRefArr.current.forEach((item) => {
					if (item.key !== routes[_tabIndex.current].key) {
						return;
					}
					if (item.value) {
						item.value.scrollToOffset({
							offset: -gestureState.dy + headerScrollStart.current,
							animated: false,
						});
					}
				});
			},
			onShouldBlockNativeResponder: () => true,
			onPanResponderGrant: (evt, gestureState) => {
				headerScrollStart.current = scrollY._value;
			},
		})
	).current;

	/**
	 * PanResponder for list in tab scene
	 */
	const listPanResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
			onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
			onStartShouldSetPanResponder: (evt, gestureState) => false,
			onMoveShouldSetPanResponder: (evt, gestureState) => {
				headerScrollY.stopAnimation();
				return false;
			},
			onShouldBlockNativeResponder: () => true,
			onPanResponderGrant: (evt, gestureState) => {
				headerScrollY.stopAnimation();
			},
		})
	).current;

	/**
	 * effect
	 */
	useEffect(() => {
		scrollY.addListener(({ value }) => {
			const curRoute = routes[tabIndex].key;
			listOffset.current[curRoute] = value;
		});

		headerScrollY.addListener(({ value }) => {
			listRefArr.current.forEach((item) => {
				if (item.key !== routes[tabIndex].key) {
					return;
				}
				if (value > HeaderHeight || value < 0) {
					headerScrollY.stopAnimation();
					syncScrollOffset();
				}
				if (item.value && value <= HeaderHeight) {
					item.value.scrollToOffset({
						offset: value,
						animated: false,
					});
				}
			});
		});
		return () => {
			scrollY.removeAllListeners();
			headerScrollY.removeAllListeners();
		};
	}, [routes, tabIndex]);

	/**
	 *  helper functions
	 */
	const syncScrollOffset = () => {
		const curRouteKey = routes[_tabIndex.current].key;

		listRefArr.current.forEach((item) => {
			if (item.key !== curRouteKey) {
				if (scrollY._value < HeaderHeight && scrollY._value >= 0) {
					if (item.value) {
						item.value.scrollToOffset({
							offset: scrollY._value,
							animated: false,
						});
						listOffset.current[item.key] = scrollY._value;
					}
				} else if (scrollY._value >= HeaderHeight) {
					if (
						listOffset.current[item.key] < HeaderHeight ||
						listOffset.current[item.key] == null
					) {
						if (item.value) {
							item.value.scrollToOffset({
								offset: HeaderHeight,
								animated: false,
							});
							listOffset.current[item.key] = HeaderHeight;
						}
					}
				}
			}
		});
	};

	const onMomentumScrollBegin = () => {
		isListGliding.current = true;
	};

	const onMomentumScrollEnd = () => {
		isListGliding.current = false;
		syncScrollOffset();
	};

	const onScrollEndDrag = () => {
		syncScrollOffset();
	};

	/**
	 * render Helper
	 */
	const renderHeader = () => {
		const y = scrollY.interpolate({
			inputRange: [0, HeaderHeight],
			outputRange: [0, -HeaderHeight],
			extrapolate: "clamp",
		});
		return (
			<Animated.View
				{...headerPanResponder.panHandlers}
				style={[styles.header, { transform: [{ translateY: y }] }]}
			>
				<TouchableOpacity activeOpacity={1}>
					<View className="bg-white rounded-t-[60px] h-[300px] -mb-9">
						<View className="p-2 items-center -top-16">
							<Image
								source={images.ppBlank}
								resizeMode="contain"
								className="w-28 h-28"
							/>
							<Text className="text-2xl font-pbold mt-3">{user.nama}</Text>
							<View
								className="rounded-xl bg-primary flex-row p-2 items-center justify-center mt-5 w-[90%] self-center"
								style={styles.boxShadow}
							>
								<View className="p-3 items-center flex-1">
									<Image
										source={icons.star}
										resizeMode="contain"
										className="w-8 h-8"
									/>
									<Text className="text-white text-sm font-pregular mt-3">
										Points
									</Text>
									<Text className="text-white text-lg font-pbold mt-2">
									{user.totalPoints?.toFixed(0)}
									</Text>
								</View>
								<View className="w-[2px] h-24 bg-input" />
								<View className="p-3 items-center flex-1">
									<Image
										source={icons.world}
										resizeMode="contain"
										className="w-8 h-8"
									/>
									<Text className="text-white text-xs font-pregular mt-3">
										Global Rank
									</Text>
									<Text className="text-white text-lg font-pbold mt-2">
										#{user.rankGlobal === 0 ? "-"  : user.rankGlobal }
									</Text>
								</View>
								<View className="w-[2px] h-24 bg-input" />
								<View className="p-3 items-center flex-1">
									<Image
										source={icons.world}
										resizeMode="contain"
										className="w-8 h-8"
									/>
									<Text className="text-white text-xs font-pregular mt-3">
										Divisi Rank
									</Text>
									<Text className="text-white text-lg font-pbold mt-2">
										#{user.rankDivisi === 0 ? "-"  : user.rankDivisi}
									</Text>
								</View>
							</View>
						</View>
					</View>
				</TouchableOpacity>
			</Animated.View>
		);
	};

	const renderTabRank = () => {
		return <Rank />;
	};

	const renderTabFriend = () => {
		return <Friend />;
	};
	const renderTabProfile = () => {
		return <Profile />;
	};

	const renderLabel = ({ route, focused }) => {
		return (
			<Text
				style={[styles.label, { color: focused ? "#FBBA18" : "#000" }]}
				className="font-psemibold"
			>
				{route.title}
			</Text>
		);
	};

	const renderScene = ({ route }) => {
		const focused = route.key === routes[tabIndex].key;
		let data;
		let renderItem;
		switch (route.key) {
			case "rank":
				renderItem = renderTabRank;
				break;
			case "friend":
				renderItem = renderTabFriend;
				break;
			case "profile":
				renderItem = renderTabProfile;
				break;

			default:
				return null;
		}
		return (
			<Animated.FlatList
				scrollEnabled={canScroll}
				{...listPanResponder.panHandlers}
				ref={(ref) => {
					if (ref) {
						const found = listRefArr.current.find((e) => e.key === route.key);
						if (!found) {
							listRefArr.current.push({
								key: route.key,
								value: ref,
							});
						}
					}
				}}
				scrollEventThrottle={16}
				onScroll={
					focused
						? Animated.event(
								[
									{
										nativeEvent: { contentOffset: { y: scrollY } },
									},
								],
								{ useNativeDriver: true }
						  )
						: null
				}
				onMomentumScrollBegin={onMomentumScrollBegin}
				onScrollEndDrag={onScrollEndDrag}
				onMomentumScrollEnd={onMomentumScrollEnd}
				ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
				ListHeaderComponent={() => <View style={{ height: 10 }} />}
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
				data={data ? data : [{ key: "1" }]}
				keyExtractor={(item, index) => index.toString()}
				renderItem={renderItem}
				contentContainerStyle={{
					paddingTop: HeaderHeight + TabBarHeight - 10,
					minHeight: windowHeight - SafeStatusBar + HeaderHeight,
				}}
			/>
		);
	};

	const renderTabBar = (props) => {
		const y = scrollY.interpolate({
			inputRange: [0, HeaderHeight],
			outputRange: [HeaderHeight, 0],
			extrapolate: "clamp",
		});
		return (
			<Animated.View
				style={{
					top: 0,
					zIndex: 2,
					position: "absolute",
					transform: [{ translateY: y }],
					width: "100%",
				}}
			>
				<TabBar
					{...props}
					onTabPress={({ route, preventDefault }) => {
						if (isListGliding.current) {
							preventDefault();
						}
					}}
					style={styles.tab}
					renderLabel={renderLabel}
					indicatorStyle={styles.indicator}
				/>
			</Animated.View>
		);
	};

	const renderTabView = () => {
		return (
			<TabView
				onSwipeStart={() => setCanScroll(false)}
				onSwipeEnd={() => setCanScroll(true)}
				onIndexChange={(id) => {
					_tabIndex.current = id;
					setIndex(id);
				}}
				navigationState={{ index: tabIndex, routes }}
				renderScene={renderScene}
				renderTabBar={renderTabBar}
				initialLayout={{
					height: 0,
					width: windowWidth,
				}}
			/>
		);
	};

	const aspectRatio = 780 / 597;
	const height = windowWidth / aspectRatio;

	return (
		<SafeAreaView className="flex-1 bg-primary">
			<Image
				source={images.texture}
				resizeMode="contain"
				className="absolute"
				style={{ width: "100%", height }}
			/>
			{renderTabView()}
			{renderHeader()}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	header: {
		height: HeaderHeight,
		width: "100%",
		position: "absolute",
		justifyContent: "flex-end",
		top: 3,
	},
	label: { fontSize: 16 },
	tab: {
		elevation: 0,
		shadowOpacity: 0,
		backgroundColor: "#fff",
		height: TabBarHeight,
	},
	indicator: { backgroundColor: "#FBBA18" },
	boxShadow: {
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.8,
		shadowRadius: 2,
		elevation: 5,
	},
});

export default Bio;
