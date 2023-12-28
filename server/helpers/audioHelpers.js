const { spawn } = require("child_process");
const fs = require("fs");

// Hàm để cắt và ghép các tệp audio và lưu dưới định dạng .wav
function cutAndConcatAudio(inputFiles, outputFilePath) {
  // Tính toán tổng thời gian của các tệp audio đầu vào
  let totalDuration = 0;
  const durations = [];

  for (const file of inputFiles) {
    const duration = getAudioDuration(file);
    durations.push(duration);
    totalDuration += duration;
  }

  // Xác định thời điểm cắt, với giới hạn là 25 giây
  let cutTime = Math.min(totalDuration, 25);

  // Sử dụng ffmpeg để cắt và ghép các tệp audio
  const ffmpegArgs = [];

  for (let i = 0; i < inputFiles.length; i++) {
    if (cutTime <= 0) break;

    const inputDuration = durations[i];
    const inputFile = inputFiles[i];

    if (cutTime >= inputDuration) {
      // Thêm toàn bộ tệp audio vào kết quả đầu ra
      ffmpegArgs.push("-i", inputFile);
      cutTime -= inputDuration;
    } else {
      // Cắt tệp audio để chỉ lấy phần cần
      const tempFile = `temp_${i}.wav`;

      ffmpegArgs.push("-i", inputFile);
      ffmpegArgs.push("-t", cutTime.toString());
      ffmpegArgs.push(tempFile);

      // Lưu thời gian cắt của tệp hiện tại để tính lại sau
      durations[i] -= cutTime;

      cutTime = 0;
    }
  }

  ffmpegArgs.push("-filter_complex", `concat=n=${inputFiles.length}:v=0:a=1[out]`);
  ffmpegArgs.push("-map", "[out]");
  ffmpegArgs.push(outputFilePath);

  const ffmpegProcess = spawn("ffmpeg", ffmpegArgs);

  ffmpegProcess.on("exit", (code) => {
    if (code === 0) {
      console.log(`Đã cắt và ghép tệp audio thành công: ${outputFilePath}`);
      // Xóa các tệp tạm thời
      for (let i = 0; i < inputFiles.length; i++) {
        if (durations[i] <= 0) {
          fs.unlinkSync(inputFiles[i]);
        }
      }
    } else {
      console.error("Lỗi trong quá trình cắt và ghép audio.");
    }
  });
}

// Hàm để lấy thời gian của tệp audio
function getAudioDuration(filePath) {
  const ffprobeProcess = spawn("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "default=noprint_wrappers=1:nokey=1",
    filePath,
  ]);

  let duration = 0;

  ffprobeProcess.stdout.on("data", (data) => {
    duration = parseFloat(data.toString());
  });

  return duration;
}

module.exports = {cutAndConcatAudio}; 
