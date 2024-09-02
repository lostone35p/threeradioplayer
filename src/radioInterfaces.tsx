export const radioList = [
	{
		name: "r/a/dio",
		url: "https://r-a-d.io/",
		api: "https://r-a-d.io/api",
		stream: "https://stream.r-a-d.io/main.mp3",
		image: "https://r-a-d.io/assets/logo_image_small.png",
	},
	{
		name: "Gensokyo Radio",
		url: "https://gensokyoradio.net/",
		api: "https://gensokyoradio.net/api/station/playing/",
		stream: "https://stream.gensokyoradio.net/1/",
		image: "https://gensokyoradio.net/images/gr8_logo.png",
	},
	{
		name: "Doujin Style",
		url: "https://doujinstyle.com",
		api: "https://public.radio.co/api/v2/s5ff57669c/track/current",
		stream: "https://streams.radio.co/s5ff57669c/listen",
		image: "https://doujinstyle.com/layout/sd/sd_utsuho.png",
	},
	{
		name: "Doujin Dance",
		url: "https://doujindance.com",
		api: "https://radio.funkot.net/api/nowplaying/doujindance_radio",
		stream: "https://radio.funkot.net/listen/doujindance_radio/playlist",
		image:
			"https://konachan.net/data/preview/d9/4f/d94ff510012fc8734e5b842abf88fe92.jpg",
	},
	{
		name: "Friends Forever",
		url: "http://www.grahambaster.com/",
		api: "https://public.radio.co/api/v2/s6140c7241/track/current",
		stream: "https://s5.radio.co/s6140c7241/listen",
		image:
			"https://konachan.net/data/preview/22/c7/22c73fae2f12e1ba62e6ca82598ba5c4.jpg",
	},
	{
		name: "Shadow69fr",
		url: "https://azuracast.shadowfr69.eu/public/shadowfr69_radio",
		api: "https://azuracast.shadowfr69.eu/api/nowplaying/shadowfr69_radio",
		stream: "https://radio.shadowfr69.eu/aac",
		image:
			"https://konachan.net/data/preview/db/9d/db9d91e8a278a9e8ee99a9c61c662508.jpg",
	},
];

// Interface for r/a/dio api
export interface radioApi {
	main: {
		np: string;
		currently: string;
		listeners: number;
		bitrate: number;
		isafkstream: boolean;
		isstreamdesk: boolean;
		current: number;
		start_time: number;
		end_time: number;
		djname: string;
		dj: {
			djname: string;
			djimage: string;
			djcolor: string;
			visible: boolean;
		};
	};
}

export interface gensokyoApi {
	SERVERINFO: {
		LASTUPDATE: number;
		STATUS: string;
		LISTENERS: number;
	};
	SONGINFO: {
		TITLE: string;
		ARTIST: string;
		ALBUM: string;
		YEAR: string;
		CIRCLE: string;
	};
	SONGTIMES: {
		DURATION: number;
		PLAYED: number;
		REMAINING: number;
		SONGSTART: number;
		SONGEND: number;
	};
	SONGDATA: {
		SONGID: number;
		ALBUMID: number;
		RATING: string;
		TIMESRATED: number;
	};
	MISC: {
		CIRCLELINK: string;
		ALBUMART: string;
		CIRCLEART: string;
		OFFSET: string;
		OFFSETTIME: number;
	};
}

// Also used for friendsforever
export interface doujinStyleApi {
	data: {
		title: string;
		start_time: string;
		artwork_urls: {
			standard: string;
			large: string;
		};
	};
}

// Also used for shadowfr
export interface doujinDanceApi {
	station: {
		id: number;
		name: string;
		shortcode: string;
		description: string;
		timezone: string;
		listen_url: string;
		url: string;
		public_player_url: string;
		playlist_pls_url: string;
		playlist_m3u_url: string;
		is_public: boolean;
	};
	listeners: {
		total: number;
		unique: number;
		current: number;
	};
	live: {
		is_live: boolean;
		streamer_name: string;
		broadcast_start: null | string;
		art: null | string;
	};
	now_playing: {
		sh_id: number;
		played_at: number;
		duration: number;
		playlist: string;
		streamer: string;
		is_request: boolean;
		song: {
			id: string;
			text: string;
			artist: string;
			title: string;
			album: string;
			genre: string;
			isrc: string;
			lyrics: string;
			art: string;
			custom_fields: any[];
		};
		elapsed: number;
		remaining: number;
	};
	is_online: boolean;
	cache: null | any;
}

// Maybe add listen.moe in the future (Uses websockets)
