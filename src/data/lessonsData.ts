// src/data/lessonsData.ts

export interface Level {
  id: number;
  name: string;
  grade: string;
  description: string;
  theme: string;
  emoji: string;
  color: string;
}

export const levels: Level[] = [
  {
    id: 1,
    name: "Starter",
    grade: "Lớp 1 & 2",
    description: "Làm quen với các từ vựng và câu nói đơn giản quanh ta.",
    theme: "Animals & Colors (Động vật & Màu sắc)",
    emoji: "🐶🎨",
    color: "linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)" // Coral & Orange
  },
  {
    id: 2,
    name: "Explorer",
    grade: "Lớp 3",
    description: "Khám phá chủ đề gia đình, trường lớp học và bạn bè.",
    theme: "My Family & School (Gia đình & Trường học)",
    emoji: "🏫👪",
    color: "linear-gradient(135deg, #4ECDC4 0%, #55E6C1 100%)" // Teal & Mint
  },
  {
    id: 3,
    name: "Challenger",
    grade: "Lớp 4 & 5",
    description: "Thử thách bản thân với chủ đề thiên nhiên, sở thích và thời tiết.",
    theme: "Hobbies & Nature (Sở thích & Thiên nhiên)",
    emoji: "🏔️🚲",
    color: "linear-gradient(135deg, #6C5CE7 0%, #8D72E1 100%)" // Purple & Violet
  }
];

export interface ListeningQuestion {
  id: number;
  audioText: string; // Text to speak
  questionText: string;
  options?: string[]; // Multiple choice options
  correctAnswer: string; // The correct answer text
  type: "choice" | "write";
}

export interface SpeakingPhrase {
  id: number;
  text: string;
  translation: string;
  visual: string; // emoji representation
}

export interface ReadingStory {
  title: string;
  text: string; // The story text
  translation: string;
  questions: {
    id: number;
    questionText: string;
    options: string[];
    correctAnswer: string;
  }[];
}

export interface WritingTask {
  id: number;
  prompt: string; // e.g., Unscramble, spell check
  scrambledWords?: string[]; // For unscrambling
  correctSentence: string;
  visual: string; // emoji or hint
  type: "unscramble" | "spell";
}

export interface LessonData {
  listening: ListeningQuestion[];
  speaking: SpeakingPhrase[];
  reading: ReadingStory;
  writing: WritingTask[];
}

export const lessonsData: Record<number, LessonData> = {
  1: {
    listening: [
      {
        id: 1,
        audioText: "Cat",
        questionText: "Bé nghe thấy con vật nào sau đây?",
        options: ["🐱 Cat (Con mèo)", "🐶 Dog (Con chó)", "🐦 Bird (Con chim)"],
        correctAnswer: "🐱 Cat (Con mèo)",
        type: "choice"
      },
      {
        id: 2,
        audioText: "Blue",
        questionText: "Bé nghe thấy màu sắc nào dưới đây?",
        options: ["🔴 Red (Màu đỏ)", "🔵 Blue (Màu xanh dương)", "🟢 Green (Màu xanh lá)"],
        correctAnswer: "🔵 Blue (Màu xanh dương)",
        type: "choice"
      },
      {
        id: 3,
        audioText: "yellow",
        questionText: "Bé hãy viết lại từ bé nghe được (Màu vàng):",
        correctAnswer: "yellow",
        type: "write"
      }
    ],
    speaking: [
      {
        id: 1,
        text: "This is a blue bird",
        translation: "Đây là một chú chim màu xanh dương.",
        visual: "🐦🔵"
      },
      {
        id: 2,
        text: "I love my cute cat",
        translation: "Tớ yêu chú mèo dễ thương của tớ.",
        visual: "🐱❤️"
      },
      {
        id: 3,
        text: "A yellow dog is running",
        translation: "Một chú chó màu vàng đang chạy.",
        visual: "🐶💛"
      }
    ],
    reading: {
      title: "My Happy Farm (Trang trại vui vẻ của tớ)",
      text: "I live on a farm. I have a red tractor. I see a white dog and a yellow cat. The green grass is beautiful. The birds fly in the blue sky. I love my happy farm.",
      translation: "Tớ sống ở một trang trại. Tớ có một chiếc xe máy cày màu đỏ. Tớ thấy một chú chó màu trắng và một chú mèo màu vàng. Thảm cỏ xanh thật đẹp. Những chú chim bay trên bầu trời xanh. Tớ yêu trang trại vui vẻ của tớ.",
      questions: [
        {
          id: 1,
          questionText: "What color is the tractor? (Chiếc xe máy cày màu gì?)",
          options: ["Red (Màu đỏ)", "Blue (Màu xanh dương)", "Yellow (Màu vàng)"],
          correctAnswer: "Red (Màu đỏ)"
        },
        {
          id: 2,
          questionText: "Where do the birds fly? (Những chú chim bay ở đâu?)",
          options: ["On the tractor", "In the grass", "In the sky"],
          correctAnswer: "In the sky"
        },
        {
          id: 3,
          questionText: "The dog is black. (Chú chó màu đen. Đúng hay Sai?)",
          options: ["True (Đúng)", "False (Sai)"],
          correctAnswer: "False (Sai)"
        }
      ]
    },
    writing: [
      {
        id: 1,
        prompt: "Sắp xếp các từ sau thành câu đúng:",
        scrambledWords: ["dog", "is", "The", "white"],
        correctSentence: "The dog is white",
        visual: "🐶⚪",
        type: "unscramble"
      },
      {
        id: 2,
        prompt: "Nhìn hình và hoàn thành từ tiếng Anh tương ứng:",
        correctSentence: "red",
        visual: "🍎 (Màu đỏ: r_d)",
        type: "spell"
      },
      {
        id: 3,
        prompt: "Nhìn hình và hoàn thành từ tiếng Anh tương ứng:",
        correctSentence: "elephant",
        visual: "🐘 (Con voi: e_ _ _ _ _ _ _)",
        type: "spell"
      }
    ]
  },
  2: {
    listening: [
      {
        id: 1,
        audioText: "My mother is nice",
        questionText: "Bé nghe thấy câu nào dưới đây?",
        options: ["My mother is nice.", "My father is tall.", "My teacher is kind."],
        correctAnswer: "My mother is nice.",
        type: "choice"
      },
      {
        id: 2,
        audioText: "classroom",
        questionText: "Bé nghe thấy từ nào?",
        options: ["🏡 House (Ngôi nhà)", "🏫 Classroom (Lớp học)", "📚 Library (Thư viện)"],
        correctAnswer: "🏫 Classroom (Lớp học)",
        type: "choice"
      },
      {
        id: 3,
        audioText: "teacher",
        questionText: "Bé nghe thấy từ gì và viết lại nào (Giáo viên):",
        correctAnswer: "teacher",
        type: "write"
      }
    ],
    speaking: [
      {
        id: 1,
        text: "My teacher is very kind to us",
        translation: "Cô giáo của tớ rất tốt bụng với chúng tớ.",
        visual: "👩‍🏫❤️"
      },
      {
        id: 2,
        text: "I read books in the school library",
        translation: "Tớ đọc sách ở thư viện trường.",
        visual: "📚🏫"
      },
      {
        id: 3,
        text: "My father likes to play soccer",
        translation: "Bố tớ thích chơi đá bóng.",
        visual: "👨⚽"
      }
    ],
    reading: {
      title: "A Day at School (Một ngày ở trường)",
      text: "Today is Monday. I go to school with my best friend, Alex. Our classroom is big and clean. We have a kind teacher named Miss Lily. She teaches us English and science. During break time, we go to the library to read funny books. I love my school.",
      translation: "Hôm nay là Thứ Hai. Tớ đi học cùng với người bạn thân nhất của tớ là Alex. Lớp học của chúng tớ rộng và sạch sẽ. Chúng tớ có một cô giáo rất tốt bụng tên là Miss Lily. Cô dạy chúng tớ tiếng Anh và khoa học. Trong giờ ra chơi, chúng tớ đến thư viện để đọc những cuốn sách hài hước. Tớ yêu trường học của tớ.",
      questions: [
        {
          id: 1,
          questionText: "Who does the writer go to school with? (Tác giả đi học cùng với ai?)",
          options: ["Miss Lily", "Alex", "His mother"],
          correctAnswer: "Alex"
        },
        {
          id: 2,
          questionText: "What subjects does Miss Lily teach? (Miss Lily dạy những môn học nào?)",
          options: ["English and science", "Math and music", "Art and history"],
          correctAnswer: "English and science"
        },
        {
          id: 3,
          questionText: "The classroom is dirty. (Lớp học bị bẩn. Đúng hay Sai?)",
          options: ["True (Đúng)", "False (Sai)"],
          correctAnswer: "False (Sai)"
        }
      ]
    },
    writing: [
      {
        id: 1,
        prompt: "Sắp xếp các từ sau thành câu đúng:",
        scrambledWords: ["mother", "nice", "is", "My"],
        correctSentence: "My mother is nice",
        visual: "👩❤️",
        type: "unscramble"
      },
      {
        id: 2,
        prompt: "Nhìn hình và hoàn thành từ còn thiếu:",
        correctSentence: "classroom",
        visual: "🏫 (Lớp học: c_ _ _ _ _ _ _ _)",
        type: "spell"
      },
      {
        id: 3,
        prompt: "Nhập từ còn thiếu: My best f_ _ _ _ _ is Alex.",
        correctSentence: "friend",
        visual: "🤝 (Bạn bè: f_ _ _ _ _)",
        type: "spell"
      }
    ]
  },
  3: {
    listening: [
      {
        id: 1,
        audioText: "The mountains are very tall",
        questionText: "Bé nghe thấy câu nào dưới đây?",
        options: ["The mountains are very tall.", "The forest is very dark.", "The river is very clean."],
        correctAnswer: "The mountains are very tall.",
        type: "choice"
      },
      {
        id: 2,
        audioText: "He goes swimming in the summer",
        questionText: "Bé nghe thấy câu nào?",
        options: [
          "She rides a bicycle to the park.",
          "He goes swimming in the summer.",
          "They climb mountains on weekends."
        ],
        correctAnswer: "He goes swimming in the summer.",
        type: "choice"
      },
      {
        id: 3,
        audioText: "weather",
        questionText: "Bé nghe thấy từ gì và viết lại nào (Thời tiết):",
        correctAnswer: "weather",
        type: "write"
      }
    ],
    speaking: [
      {
        id: 1,
        text: "We ride our bicycles around the green lake",
        translation: "Chúng tớ đạp xe quanh hồ nước xanh mát.",
        visual: "🚲🟢"
      },
      {
        id: 2,
        text: "The summer weather is perfect for swimming",
        translation: "Thời tiết mùa hè thật hoàn hảo để đi bơi.",
        visual: "☀️🏊"
      },
      {
        id: 3,
        text: "I want to explore the mysterious forest",
        translation: "Tớ muốn khám phá khu rừng kỳ bí.",
        visual: "🌲🕵️"
      }
    ],
    reading: {
      title: "Our Trip to the Mountains (Chuyến đi núi của chúng tớ)",
      text: "Last summer, my family went to the high mountains. The weather was cool and sunny. The trees in the forest were green and tall. We walked along a clean river and drank fresh water. I took many pictures of wild flowers. It was a wonderful adventure.",
      translation: "Mùa hè năm ngoái, gia đình tớ đã lên vùng núi cao. Thời tiết ở đó rất mát mẻ và đầy nắng. Những cái cây trong rừng thì xanh tươi và cao lớn. Chúng tớ đã đi dọc theo một dòng sông trong sạch và uống nước mát lành. Tớ đã chụp rất nhiều ảnh hoa dại. Đó là một chuyến phiêu lưu tuyệt vời.",
      questions: [
        {
          id: 1,
          questionText: "When did the family go to the mountains? (Gia đình đi leo núi khi nào?)",
          options: ["Last summer (Mùa hè năm ngoái)", "Last winter (Mùa đông năm ngoái)", "Today (Hôm nay)"],
          correctAnswer: "Last summer (Mùa hè năm ngoái)"
        },
        {
          id: 2,
          questionText: "How was the weather? (Thời tiết như thế nào?)",
          options: ["Hot and rainy", "Cold and cloudy", "Cool and sunny"],
          correctAnswer: "Cool and sunny"
        },
        {
          id: 3,
          questionText: "They drank soda from the river. (Họ uống nước ngọt từ dòng sông. Đúng hay Sai?)",
          options: ["True (Đúng)", "False (Sai)"],
          correctAnswer: "False (Sai)"
        }
      ]
    },
    writing: [
      {
        id: 1,
        prompt: "Sắp xếp các từ sau thành câu đúng:",
        scrambledWords: ["We", "ride", "bicycles", "in", "the", "park"],
        correctSentence: "We ride bicycles in the park",
        visual: "🚲🌳",
        type: "unscramble"
      },
      {
        id: 2,
        prompt: "Nhìn hình và hoàn thành từ tương ứng:",
        correctSentence: "mountain",
        visual: "🏔️ (Núi: m_ _ _ _ _ _ _)",
        type: "spell"
      },
      {
        id: 3,
        prompt: "Nhập từ còn thiếu: Hiking in the m_ _ _ _ _ _ _ _ is fun.",
        correctSentence: "mountains",
        visual: "🥾🏔️ (Những ngọn núi: m_ _ _ _ _ _ _ _)",
        type: "spell"
      }
    ]
  }
};
