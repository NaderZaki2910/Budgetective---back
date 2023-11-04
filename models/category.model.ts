type Category = {
  id?: number;
  name: string;
  child_of?: number;
  date_created?: Date;
  last_edited?: Date;
  child_count?: number;
};

export default Category;
