import { MongoClient } from "mongodb";

// [수정됨] sibal 코드의 하드코딩된 접속 주소 적용
const url =
  "mongodb+srv://admin:qwer1234@cluster0.ysibzsj.mongodb.net/cloudytest";
const options = { useNewUrlParser: true };

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // 개발 모드: 전역 변수(_mongo)를 사용하여 연결 유지 (sibal 로직 적용)
  if (!global._mongo) {
    client = new MongoClient(url, options);
    global._mongo = client.connect();
  }
  clientPromise = global._mongo;
} else {
  // 배포 모드: 매번 새 연결 생성
  client = new MongoClient(url, options);
  clientPromise = client.connect();
}

// nonmode의 다른 파일들이 import clientPromise from ... 로 쓰고 있으므로 default export 유지
export default clientPromise;
