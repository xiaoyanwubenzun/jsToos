var addStrings = function(num1, num2) {
    return (BigInt(num1)+BigInt(num2)).toString();
};
var addStrings1 = function(num1, num2) {
    const numArr1 = num1.split('').reverse();
    const numArr2 = num2.split('').reverse();
    let temp = 0;
    let index = 0;
    const result = [];
    while(numArr1.length > index || numArr2.length > index){
        let item1 = numArr1.length > index ? numArr1[index] : 0;
        let item2 = numArr2.length > index ? numArr2[index] : 0;
        let res = Number(item1) + Number(item2) + temp;
        temp = res > 9 ? 1: 0;
        result.push(res % 10);
        index++;
    }
    if(temp === 1){ result.push(1) }
    return result.reverse().join('');
};