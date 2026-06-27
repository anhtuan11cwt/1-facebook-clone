const posts = [
  {
    caption: "Vừa hoàn thành dự án mới! Cảm ơn mọi người đã ủng hộ 🚀",
    comments: [
      {
        content: "Tuyệt vời! Chúc mừng bạn 🎉",
        createdAt: "1 giờ trước",
        id: 1,
        user: { avatar: null, name: "Tran Thi B" },
      },
      {
        content: "Đẹp quá! Cho mình hỏi dùng công nghệ gì vậy?",
        createdAt: "30 phút trước",
        id: 2,
        user: { avatar: null, name: "Le Van C" },
      },
      {
        content: "Mình cũng đang học làm dạng này, có tips gì không bạn?",
        createdAt: "15 phút trước",
        id: 3,
        user: { avatar: null, name: "Pham Thi D" },
      },
    ],
    createdAt: "2 giờ trước",
    id: 1,
    likes: 42,
    mediaSrc: "/demo/story-1.jpg",
    mediaType: "image",
    shares: 7,
    user: {
      avatar: null,
      name: "Nguyen Van A",
    },
  },
  {
    caption: "Cuối tuần rồi, đi cà phê thôi nào ☕",
    comments: [
      {
        content: "Quán nào vậy bạn?",
        createdAt: "4 giờ trước",
        id: 1,
        user: { avatar: null, name: "Mai Thi F" },
      },
    ],
    createdAt: "5 giờ trước",
    id: 2,
    likes: 18,
    mediaSrc: "/demo/story-5.mp4",
    mediaType: "video",
    shares: 3,
    user: {
      avatar: null,
      name: "Hoang Van E",
    },
  },
  {
    caption: "Một ngày mới đầy năng lượng! 🌅",
    comments: [],
    createdAt: "7 giờ trước",
    id: 3,
    likes: 56,
    mediaSrc: "/demo/story-3.jpg",
    mediaType: "image",
    shares: 12,
    user: {
      avatar: null,
      name: "Le Van C",
    },
  },
];

export default posts;
