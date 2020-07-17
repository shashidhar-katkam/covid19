export default class Util {
  public static phonenumber(inputText: string): boolean {
    let phoneno: RegExp = /^\d{10}$/;
    if (inputText.match(phoneno)) {
      return true;
    }
    else {
      return false;
    }
  }

  public static validateEmail(email: string): boolean {
    let filter: RegExp = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (filter.test(email)) {
      return true;
    }
    else {
      return false;
    }
  }

  public static validateMobileNo(mobileNo: string): boolean {
    let filter: RegExp = /^(([0-9]{10})|(0[0-9]{10}))$/;
    if (filter.test(mobileNo)) {
      return true;
    }
    else {
      return false;
    }
  }

  public static validateWebSiteUrl(Url: string): boolean {
    let filter: RegExp = /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/;
    if (filter.test(Url)) {
      return true;
    }
    else {
      return false;
    }
  }

  private static isToday(someDate: any) {
    const today = new Date()
    return someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear()
  }


  public static formatAMPM(date: any) {
    let dateT = new Date(date);
    let hours = dateT.getHours();
    let minutes = dateT.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    let dateTo = '';
    if (this.isToday(dateT)) {
      dateTo = 'Today,';
    } else {
      dateTo = dateT.toDateString();
    }
    let minutess = minutes < 10 ? '0' + minutes : minutes;
    const strTime = dateTo + ' ' + hours + ':' + minutess + ' ' + ampm;
    return strTime;
  }

  public static extractYoutubeVideoID(url: string) {
    let n = url.indexOf("embed");
    let index = 0;
    if (n !== -1) {
      index = n + 6;
    } else if (url.indexOf("watch") !== -1) {
      let temp = url.indexOf("watch");
      index = temp + 8;
    } else {
      let temp = url.indexOf('youtu.be');
      index = temp + 9;
    }
    return url.substring(index);
  }
}



