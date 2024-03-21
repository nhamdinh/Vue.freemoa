import moment from "moment"
import { REGEX_CURRENCY } from "./constance";

// let exports: any = {}
export const displayTimeLeft = (seconds: any) => {
  let min = Math.floor(seconds / 60);
  let secondsLeft = seconds % 60;
  let sec =
    secondsLeft.toString().length === 1 ? "0" + secondsLeft : secondsLeft;
  return `${min}:${sec}`;
};

export const removeNonNumeric = (num: string) => {
  const result = ~~num.replace(/[^\d]/g, '')
  return result
}


export const formatMoney = (text: any) => {
  if (!text) {
    return '0'
  } else {
    if (+text < 0) {
      text = +text * -1
      return '-' + text.toString().replace(REGEX_CURRENCY, "$1,")
    } else {
      return text.toString().replace(REGEX_CURRENCY, "$1,")
    }
  }
}

export const removeCompFunc = (regisArr: [], uniKey: any) => {
  let regisArrLength_temp: any = [...regisArr]

  regisArrLength_temp.map((regis: any) => {
    if (regis?.uniKey === uniKey) {
      regis.isShow = false
    }
  })

  return regisArrLength_temp
}
export const handleRemoveRecordByKey = (dataSearch: [], childData: any) => {
  let dataSearch_temp: any = [...dataSearch]
  dataSearch_temp.map((record: any) => {
    if (record?.key === childData?.key) {
      record.checked = true
    }
  })
  return dataSearch_temp
}
export const handleRemoveRecord = (dataSearch: [], childData: any) => {
  let dataSearch_temp: any = [...dataSearch]
  dataSearch_temp.map((record: any) => {
    if (record?.id === childData?.id) {
      record.checked = true
    }
  })
  return dataSearch_temp
}
export const handleCheckbox = (dataSearch: [], childData: any) => {
  let dataSearch_temp: any = [...dataSearch]
  dataSearch_temp.map((record: any) => {
    if (record?.id === childData?.id) {
      record.checked = !record?.checked
    }
  })
  return dataSearch_temp
}
export const getDurationBetween = (afterDate: any, beforeDate: any) => {
  var afterTime = moment(afterDate);
  var beforeTime = moment(beforeDate);
  let days = afterTime.diff(beforeTime, "days");
  let seconds = afterTime.diff(beforeTime, "seconds");
  let hour = afterTime.diff(beforeTime, "hours");
  let min =
    afterTime.diff(beforeTime, "minutes") -
    afterTime.diff(beforeTime, "hours") * 60;
  if (hour < 0 || Number.isNaN(hour)) hour = 0;
  if (min < 0 || Number.isNaN(min)) min = 0;
  let duration = hour * 60 + min;
  // console.log(days)
  return days;
};
export const getDurationBetweenseconds = (afterDate: any, beforeDate: any) => {
  var afterTime = moment(afterDate);
  var beforeTime = moment(beforeDate);
  let days = afterTime.diff(beforeTime, "days");
  let seconds = afterTime.diff(beforeTime, "seconds");
  let hour = afterTime.diff(beforeTime, "hours");
  let min =
    afterTime.diff(beforeTime, "minutes") -
    afterTime.diff(beforeTime, "hours") * 60;
  if (hour < 0 || Number.isNaN(hour)) hour = 0;
  if (min < 0 || Number.isNaN(min)) min = 0;
  let duration = hour * 60 + min;
  // console.log(days)
  return seconds;
};

export const rawMarkup = (rawMarkup = "") => {
  return { __html: rawMarkup };
};
// export default exports
export const formatPhone = (val: string) => {
  return val.replace(" ", "").replace(/[^0-9 ]+/g, "");
};

export const NumbersOnly = (evt: any) => {
  evt = evt ? evt : window.event
  var charCode = evt.which ? evt.which : evt.keyCode
  if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
    evt.preventDefault()
  } else {
    return true
  }
}

export const formatCustomerPhoneNumber = (value: string) => {
  if (!value) return;
  return `${value.slice(0, 2)}-${value.slice(2, 6)}-${value.slice(6)}`;
};

export const handleUpdateFavorite = (id: any, dataCompany: any) => {
  let arrr1: any = [...dataCompany]
  let arrr2: any = []
  arrr1.map((item: any) => {
    if (item?.id === id) {
      arrr2.push({ ...item, isFavorite: !item?.isFavorite })
    } else {
      arrr2.push(item)
    }
  })
  return [...arrr2]
}

export const handleUpdateFavoriteDetail = (obj: any) => {
  return { ...obj, isFavorite: !obj?.isFavorite }
}

export const handleUpdateLike = (obj: any) => {
  let coefficient = 1
  if (obj?.isLike) {
    coefficient = -1
  }
  return {
    ...obj,
    isLike: !obj?.isLike,
    totalLikes: Number(obj?.totalLikes) + coefficient
  }
}

export const isPassMatch = (pass: string, repass: string) => {
  let match = true
  if (pass.length > 0 && repass.length > 0) {
    if (pass === repass) {
      match = true
    } else {
      match = false
    }
  } else {
    match = true
  }
  return match
}


export const getFileName = (text: any, module: any) => {
  if (!text) {
    return '0'
  } else {
    let string1 = text
    if (string1.includes(module)) {
      let start = string1.indexOf(module) + module.length
      let end = string1.indexOf('"', start)
      let result = string1.slice(start, end)
      return result
    }
    return text
  }
}

export const getPre = (dataArticle: any, id: any) => {
  const dataArticle_tem: any = []
  dataArticle.map((item: any) => {
    dataArticle_tem.push(item.toString())
  })
  let index = dataArticle_tem.indexOf(id.toString())
  let length = dataArticle_tem.length
  if (index + 1 === length) {
    return -1
  }
  return dataArticle_tem[index + 1]
}

export const getNext = (dataArticle: any, id: any) => {
  const dataArticle_tem: any = []
  dataArticle.map((item: any) => {
    dataArticle_tem.push(item.toString())
  })
  let index = dataArticle_tem.indexOf(id.toString())
  if (index === 0) {
    return -1
  }
  return dataArticle_tem[index - 1]
}