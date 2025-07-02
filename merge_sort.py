def merge(left, right):
    """
    2つのソート済みリストをマージする関数
    """
    result = []
    i = j = 0
    
    # 両方のリストの要素を比較しながらマージ
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    # 残りの要素を追加
    result.extend(left[i:])
    result.extend(right[j:])
    
    return result

def merge_sort(arr):
    """
    再帰的にマージソートを実行する関数
    """
    # ベースケース：配列の長さが1以下の場合はそのまま返す
    if len(arr) <= 1:
        return arr
    
    # 配列を2つに分割
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    # 分割した配列をマージ
    return merge(left, right)

# テスト
if __name__ == "__main__":
    # テストケース
    test_array = [64, 34, 25, 12, 22, 11, 90]
    print("元の配列:", test_array)
    sorted_array = merge_sort(test_array)
    print("ソート後の配列:", sorted_array) 