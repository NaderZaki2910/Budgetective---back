interface IPagingService {
  pageArray(array: object[], page: number, pageSize: number): Promise<any>;
}

class PagingService implements IPagingService {
  async pageArray(
    array: object[],
    page: number,
    pageSize: number
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      var totalItems = array.length;
      var totalPages = Math.ceil(array.length / pageSize);
      if (totalPages == page && totalPages != 1) {
        var totElementsNotNeeded = (totalPages - 1) * pageSize;
        array = array.splice(
          totElementsNotNeeded,
          array.length - totElementsNotNeeded
        );
      } else {
        if (page == 1) {
          array = array.splice(0, pageSize);
        } else {
          var totElementsNotNeeded = (page - 1) * pageSize;
          array = array.splice(totElementsNotNeeded, pageSize);
        }
      }
      resolve({ pagedArray: array, totalItems: totalItems });
    });
  }
}

export default new PagingService();
