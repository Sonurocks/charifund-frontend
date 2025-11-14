
export interface Category {
  id: string;
  name: {
    en: string;
    hi: string;
  };
}

export interface CategoryColumnCallbacks {
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onView: (category: Category) => void;
}