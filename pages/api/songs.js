import clientPromise from "../../util/database";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const client = await clientPromise;

    // ★ [수정됨] DB 이름을 'cloudify' -> 'cloudytest'로 변경 (sibal 코드 기준)
    // 이 이름이 틀리면 데이터가 0개로 나옵니다.
    const db = client.db("cloudytest");

    // 'songs' 컬렉션에서 데이터 가져오기
    const songs = await db.collection("playlist").find({}).limit(50).toArray();

    // 데이터 가공 (videoId만 있어도 작동하도록)
    const formattedSongs = songs.map((song) => {
      const vId = song.videoId || song.video_id || "";

      return {
        _id: song._id.toString(),
        videoId: vId,
        // 제목이 없으면 임시 제목 생성
        title: song.title || `Track ${vId.substring(0, 5)}...`,
        // 가수가 없으면 임시 가수 생성
        artist: song.artist || "Unknown Artist",
        // 썸네일 자동 생성 (hqdefault 사용)
        cover: song.cover || `https://i.ytimg.com/vi/${vId}/hqdefault.jpg`,
      };
    });

    res.status(200).json(formattedSongs);
  } catch (e) {
    console.error("DB Error:", e);
    res.status(500).json({ message: "DB Connection Failed" });
  }
}
