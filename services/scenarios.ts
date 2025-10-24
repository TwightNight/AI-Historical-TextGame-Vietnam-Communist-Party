import type { GameSetupState } from '../types';

export const PREDEFINED_SCENARIOS: GameSetupState[] = [
  // 1. Hội nghị thành lập Đảng, 1930
  {
    narrative: 'Cửu Long, Hồng Kông, tháng 2 năm 1930. Không khí trong căn phòng nhỏ cực kỳ khẩn trương. Dưới sự chủ trì của lãnh tụ Nguyễn Ái Quốc, các đại biểu ưu tú nhất của An Nam Cộng sản Đảng và Đông Dương Cộng sản Đảng đang ngồi lại với nhau. Sứ mệnh lịch sử là hợp nhất các tổ chức cộng sản, thành lập một chính đảng duy nhất để lãnh đạo cách mạng Việt Nam. Tuy nhiên, những bất đồng về tên gọi của Đảng mới và các điểm trong cương lĩnh vẫn còn gay gắt, đe dọa phá vỡ hội nghị. Thời gian không chờ đợi ai. Mật thám Anh và Pháp đang lùng sục khắp nơi. Số phận của cả một cuộc cách mạng đang nằm trong tay bạn, Nguyễn Ái Quốc.',
    choices: [
      { id: '1a', text: 'Ưu tiên thống nhất tư tưởng: Giữ tên "Đảng Cộng sản Việt Nam", nhấn mạnh vai trò công nhân và đấu tranh giai cấp.' },
      { id: '1b', text: 'Lấy đại cục làm trọng: Đề xuất tên trung lập "Đảng Cộng sản Đông Dương" để nhanh chóng đạt đồng thuận.' },
      { id: '1c', text: 'Tập trung vào hành động: Tạm gác lại tên gọi, ưu tiên thống nhất Cương lĩnh và Sách lược vắn tắt để Đảng hoạt động ngay.' },
    ],
  },
  // 2. Cách mạng tháng Tám, 1945
  {
    narrative: 'Tân Trào, Tuyên Quang, ngày 13 tháng 8 năm 1945. Tin tức Nhật hoàng tuyên bố đầu hàng Đồng minh lan truyền như một luồng điện. Thời cơ "ngàn năm có một" đã đến. Khoảng trống quyền lực đang mở ra, nhưng cũng vô cùng mong manh. Quân Pháp lăm le quay lại, quân Tưởng đang chờ ở biên giới. Tại Hội nghị toàn quốc của Đảng, không khí vừa phấn khởi vừa căng thẳng. Là một đồng chí trong Thường vụ Trung ương, bạn phải đưa ra quyết định có tính sống còn: Chớp lấy thời cơ hay chờ đợi thời điểm chín muồi hơn?',
    choices: [
      { id: '2a', text: 'Phát động Tổng khởi nghĩa ngay lập tức trên toàn quốc, chấp nhận rủi ro để giành chính quyền trước khi Đồng minh tới.' },
      { id: '2b', text: 'Tập trung lực lượng tinh nhuệ nhất khởi nghĩa ở Hà Nội và các thành phố lớn trước để tạo tiếng vang, sau đó lan rộng.' },
      { id: '2c', text: 'Tránh xung đột vũ trang lớn, chờ quân Đồng minh vào giải giáp quân Nhật, đồng thời bí mật củng cố lực lượng.' },
    ],
  },
  // 3. Chiến dịch Điện Biên Phủ, 1954
  {
    narrative: 'Sở chỉ huy tại Mường Phăng, ngày 26 tháng 1 năm 1954. Đại tướng Võ Nguyên Giáp và Bộ chỉ huy chiến dịch đang đứng trước một trong những quyết định cân não nhất. Toàn bộ pháo binh đã được kéo vào trận địa, sẵn sàng cho phương án "đánh nhanh, thắng nhanh". Nhưng báo cáo trinh sát cuối cùng cho thấy địch đã củng cố tập đoàn cứ điểm thành một pháo đài bất khả xâm phạm. Tiếp tục kế hoạch có thể dẫn đến thất bại thảm khốc. Thay đổi phương châm sang "đánh chắc, tiến chắc" là một thách thức hậu cần và tâm lý khổng lồ, đòi hỏi phải kéo pháo ra và chuẩn bị lại từ đầu. Tương lai của cuộc kháng chiến chống Pháp phụ thuộc vào quyết định này.',
    choices: [
      { id: '3a', text: 'Giữ vững phương châm "đánh nhanh, thắng nhanh", tin vào yếu tố bất ngờ và nhuệ khí của bộ đội.' },
      { id: '3b', text: 'Quyết đoán thay đổi sang "đánh chắc, tiến chắc", đặt mục tiêu thắng lợi cuối cùng lên trên hết, dù khó khăn đến mấy.' },
      { id: '3c', text: 'Áp dụng chiến thuật "vây lấn" có điều chỉnh: Bắt đầu bằng việc bao vây, đánh các cứ điểm ngoại vi để làm suy yếu địch.' },
    ],
  },
  // 4. Thống nhất đất nước và kinh tế, 1976
  {
    narrative: 'Hà Nội, năm 1976. Niềm vui thống nhất đất nước vừa lắng xuống, những thách thức khổng lồ của thời hậu chiến đã hiện ra. Miền Bắc với kinh tế kế hoạch hóa tập trung, miền Nam với nền kinh tế thị trường và sở hữu tư nhân sôi động. Hai cơ chế hoàn toàn khác biệt. Đại hội Đảng lần thứ IV sắp diễn ra, và câu hỏi về mô hình kinh tế cho cả nước đang là vấn đề nóng bỏng nhất. Là một nhà hoạch định chính sách, con đường bạn chọn sẽ định hình tương lai kinh tế của Việt Nam trong nhiều thập kỷ tới.',
    choices: [
      { id: '4a', text: 'Áp dụng mô hình kinh tế kế hoạch hóa tập trung trên toàn quốc để đảm bảo sự thống nhất tuyệt đối.' },
      { id: '4b', text: 'Thiết lập giai đoạn quá độ, cho phép kinh tế tư nhân ở miền Nam tồn tại có kiểm soát để tránh gây sốc.' },
      { id: '4c', text: 'Thí điểm các "khu kinh tế đặc biệt" ở một vài thành phố lớn phía Nam để thử nghiệm mô hình kết hợp.' },
    ],
  },
  // 5. Trước thềm Đổi Mới, 1986
  {
    narrative: 'Hà Nội, tháng 12 năm 1986. Đất nước chìm trong khủng hoảng kinh tế - xã hội. Lạm phát phi mã, hàng hóa khan hiếm, đời sống nhân dân vô cùng khó khăn. Mô hình kế hoạch hóa tập trung, quan liêu bao cấp đã tới giới hạn. Trước thềm Đại hội VI, những cuộc tranh luận về con đường đi lên của đất nước diễn ra gay gắt. Các luồng tư tưởng bảo thủ vẫn còn rất mạnh, lo ngại sự chệch hướng. Là một ủy viên Bộ Chính trị có tư tưởng cấp tiến, bạn biết rằng phải có một sự thay đổi mang tính đột phá. Nhưng đột phá đến đâu?',
    choices: [
      { id: '5a', text: 'Dũng cảm đề xuất một cuộc "Đổi Mới" toàn diện, chấp nhận kinh tế thị trường có sự quản lý của Nhà nước.' },
      { id: '5b', text: 'Chủ trương cải cách từng bước, nới lỏng "khoán" trong nông nghiệp và cho một số doanh nghiệp tự chủ hơn.' },
      { id: '5c', text: 'Cho rằng vấn đề nằm ở khâu thực hiện, cần tăng cường quản lý, siết chặt kỷ luật để mô hình cũ hiệu quả hơn.' },
    ],
  }
];
