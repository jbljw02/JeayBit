// 객체의 모든 키를 카멜 케이스로 변환
const convertToCamelCase = (obj: Record<string, any>): Record<string, any> => {
    const newObj: Record<string, any> = {};
    Object.keys(obj).forEach((key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      newObj[camelKey] = obj[key];
    });
    return newObj;
  };

export default convertToCamelCase;