import { Types } from "mongoose";
import { Chapter } from "../modules/chapter/chapter.model";
import { Lesson } from "../modules/lesson/lesson.model";

export async function updateChapterDuration(chapterId: Types.ObjectId) {
  const result = await Lesson.aggregate([
    {
      $match: { chapter: chapterId },
    },
    {
      $group: {
        _id: "$chapter",
        total: { $sum: "$duration" },
      },
    },
  ]);

  const total = result.length ? result[0].total : 0;

  await Chapter.findByIdAndUpdate(chapterId, {
    totalDuration: total,
  });
}
