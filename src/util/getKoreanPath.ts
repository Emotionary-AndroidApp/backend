export default function getKoreanPath(path: (string | number)[]) {
  return path.map((key) => {
    if (typeof key === "number") {
      return key;
    }
    switch (key) {
      case "email":
        return "이메일";
      case "token":
        return "토큰";
      case "name":
        return "이름";
      case "password":
        return "비밀번호";
    }
    return key;
  });
}
