console.log("start")
let parallel = function(arr, finnaly) {
    let fn,
      index = 0;
    let statusArr = Array(arr.length)
      .fill(undefined)
      .map(() => ({
        isActive: false,
        data: null
      }));
    let isFinished = function() {
      return statusArr.every(item => {
        return item.isActive === true;
      });
    };
    let resolve = function(index) {
      return function(data) {
        statusArr[index].data = data;
        statusArr[index].isActive = true;
        let isFinish = isFinished();
        if (isFinish) {
          let datas = statusArr.map(item => {
            return item.data;
          });
          finnaly(datas);
        }
      };
    };
    while ((fn = arr.shift())) {
      // 给resolve函数追加参数,可以使用bind函数实现,这里使用了柯里化
      fn(resolve(index));
      index++;
    }
  };
  
  // 使用方法
  let str = "";
  parallel(
    [
      function(resolve) {
        setTimeout(function() {
          str = "Hello";
          resolve("Hello");
        }, 1000);
      },
      function(resolve) {
        setTimeout(function() {
          str += "World";
          resolve("World");
        }, 20);
      }
    ],
    function(datas) {
      console.log("finily", datas);
    }
  );