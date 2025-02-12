# 스네이크 케이스 문자열을 카멜 케이스로 변환
def convert_to_camel_case(snake_str):
    components = snake_str.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])

# 딕셔너리의 모든 키를 카멜 케이스로 변환
def convert_dict_to_camel_case(data):
    if isinstance(data, dict):
        return {
            convert_to_camel_case(key): convert_dict_to_camel_case(value)
            for key, value in data.items()
        }
    elif isinstance(data, list):
        return [convert_dict_to_camel_case(item) for item in data]
    return data 