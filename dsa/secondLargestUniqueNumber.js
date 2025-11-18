function secondLargest(nums) {
    let first = -Infinity, second = -Infinity;
    const unique = new Set(nums);

    for (let num of unique) {
        if (num > first) {
            second = first;
            first = num;
        } else if (num > second && num < first) {
            second = num;
        }
    }

    return second === -Infinity ? -1 : second;
}
console.log(secondLargest([3, 5, 2, 5, 6, 6, 1]));
console.log(secondLargest([7, 7, 7]));