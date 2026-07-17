import { Star, Heart, Sparkles, MapPin, Gift, Music } from "lucide-react";

export const FALLBACK_START = new Date("2024-02-14");

export const FALLBACK_MILESTONES = [
  { date: "2024.02.14", title: "初次相遇", desc: "在朋友的聚会上，人潮中一眼就看到了你", icon: "star" },
  { date: "2024.03.08", title: "第一次约会", desc: "那家咖啡馆的拿铁很好喝，但你的笑容更好", icon: "heart" },
  { date: "2024.05.20", title: "在一起", desc: "你点头的那一刻，整个世界都亮了", icon: "sparkles" },
  { date: "2024.08.15", title: "第一次旅行", desc: "一起看了海，说了好多好多的话", icon: "map" },
  { date: "2024.12.25", title: "第一个圣诞节", desc: "最好的礼物不是树下的，是身边的", icon: "gift" },
  { date: "2025.02.14", title: "一周年", desc: "365天，每一天都比昨天更爱你", icon: "music" },
];

export const FALLBACK_DIARY = [
  { date: "2025.06.15", title: "今天的晚霞", text: "傍晚散步的时候，天边出现了很美的晚霞。第一反应是拍给你看，才发现你就在身边。原来最美的风景，一直就在身旁。", tag: "日常" },
  { date: "2025.06.10", title: "一起做晚饭", text: "你切菜我炒菜，厨房里弥漫着饭菜香和你身上的味道。这样平凡的日常，却是我最珍贵的幸福。", tag: "日常" },
  { date: "2025.05.28", title: "下雨天", text: "突然下起了大雨，你撑伞跑过来接我。伞不大，你半边肩膀都淋湿了，却笑着说没事。那一刻，心又动了一次。", tag: "心动" },
  { date: "2025.05.20", title: "一周年倒计时", text: "还有十个月就到一周年了。已经开始在想怎么庆祝，但其实和你在一起的每一天，都值得庆祝。", tag: "纪念" },
  { date: "2025.05.01", title: "逛宜家", text: "一起逛宜家，想象着未来家的样子。你坐在沙发上说'这个好舒服'，我在旁边偷偷笑了——因为我想的是'我们的家'。", tag: "日常" },
  { date: "2025.04.18", title: "深夜电话", text: "凌晨两点睡不着，打给你。你迷迷糊糊地接了，声音软软的。那一刻觉得，世界上最安心的声音就是你的声音。", tag: "心动" },
];

export const FALLBACK_GALLERY = [
  { gradient: "linear-gradient(135deg, #f8b4b4, #fb7185)", h: 220 },
  { gradient: "linear-gradient(135deg, #c4b5fd, #8b5cf6)", h: 280 },
  { gradient: "linear-gradient(135deg, #fcd6bb, #fb923c)", h: 200 },
  { gradient: "linear-gradient(135deg, #67e8f9, #06b6d4)", h: 300 },
  { gradient: "linear-gradient(135deg, #f9a8d4, #ec4899)", h: 240 },
  { gradient: "linear-gradient(135deg, #bef264, #84cc16)", h: 260 },
  { gradient: "linear-gradient(135deg, #fde68a, #f59e0b)", h: 210 },
  { gradient: "linear-gradient(135deg, #a5b4fc, #6366f1)", h: 290 },
];

export const FALLBACK_LETTERS = [
  { title: "给你的一封情书", text: "亲爱的，\n\n写这封信的时候，窗外正下着小雨。想起第一次见你的那天，也是这样的天气。你笑着跟我打招呼，我的心就那样不争气地跳快了。\n\n谢谢你出现在我的生命里，让每一个平凡的日子都变得闪闪发光。\n\n永远爱你的人" },
  { title: "谢谢你", text: "谢谢你，在我加班到很晚的时候给我送夜宵。谢谢你，记住我随口说的小事。谢谢你，在我心情不好的时候安静地陪着我。\n\n你做的每一件小事，我都记在心里。这些点点滴滴的温暖，汇聚成了我最珍贵的幸福。" },
  { title: "关于未来", text: "我想象的未来里，每一个画面都有你。\n\n早上一起喝咖啡，晚上一起散步。周末去没去过的地方逛逛，节假日回老家看爸妈。\n\n不需要轰轰烈烈，只要有你，平平淡淡就是最好的日子。" },
];

export const iconMap = { star: Star, heart: Heart, sparkles: Sparkles, map: MapPin, gift: Gift, music: Music };
