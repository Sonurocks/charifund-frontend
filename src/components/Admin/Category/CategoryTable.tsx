



"use client";
import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { CategorySearchOptions } from "../Data/staticData";
import { useFetchCategory, useDeleteCategory, useFetchCategoryById } from "@/src/hooks/admin/useCategory";
import { Category } from "@/src/types/admin/category";
import toast from "react-hot-toast";
import useDebounce from "@/src/hooks/web/useDebounce";

//  Dynamic imports (only for heavy React components)
const Dropdown = dynamic(() => import("../../UI/admin/Dropdown"), { ssr: false });
const CustomInput = dynamic(() => import("../../UI/admin/CustomInput"), { ssr: false });
const Button = dynamic(() => import("../../UI/web/Buttons/Button"), { ssr: false });
const Drawer = dynamic(() => import("../../UI/admin/Drawer"), { ssr: false });
const DataTableWrapper = dynamic(() => import("../../UI/admin/DataTableWrapper"), { ssr: false });
const AnimatedReveal = dynamic(() => import("@/src/animations/AnimatedReveal"), { ssr: false });
const CategoryForm = dynamic(() => import("./CategoryForm"), { ssr: false });
const AdminCustomPagination = dynamic(() => import("../../UI/admin/CustomePagination"), { ssr: false });
const CustomLoader = dynamic(() => import("../../UI/web/Loader/CustomLoader"), { ssr: false });
const ConfirmModal = dynamic(() => import("../../UI/admin/ConfirmModal"), { ssr: false });

const CategoryTable = () => {
  const [columns, setColumns] = useState<any[]>([]); // store columns after dynamic import
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [seletedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchField, setSearchField] = useState<"name">("name");
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<string | null>(null);
  const [mode, setMode] = useState<"add" | "edit" | "view">("add");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const debounceValue = useDebounce(search, 1000);

  const { data: categoryData, isLoading } = useFetchCategory(currentPage, itemsPerPage, debounceValue, searchField);
  const { data: singleCategoryData } = useFetchCategoryById(editCategory!);
  const deleteCategory = useDeleteCategory();

  useEffect(() => {
    //Dynamically import the getCategoryColumns function (proper way)
    import("./categoryColumns").then((mod) => {
      const { getCategoryColumns } = mod;
      setColumns(
        getCategoryColumns({
          onEdit: handleEdit,
          onDelete: handleDelete,
          onView: handleView,
        })
      );
    });
  }, []); // run once on mount

  useEffect(() => {
    if (mode === "view" && singleCategoryData) {
      setDrawerOpen(true);
    }
  }, [singleCategoryData, mode]);

  const handleEdit = useCallback((c: Category) => {
    setEditCategory(c.id);
    setMode("edit");
    setDrawerOpen(true);
  }, []);

  const handleView = useCallback((c: Category) => {
    setEditCategory(c.id);
    setMode("view");
    setDrawerOpen(true);
  }, []);

  const handleDelete = useCallback((category: Category) => {
    setSelectedCategory(category);
    setIsOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (seletedCategory?.id) {
      setDeleteLoading(true);
      toast.dismiss();
      toast.loading("Deleting Category...");
      deleteCategory.mutate(seletedCategory.id.toString(), {
        onSuccess: () => {
          setDeleteLoading(false);
          setIsOpen(false);
          setSelectedCategory(null);
        },
        onError: () => {
          setDeleteLoading(false);
          setIsOpen(false);
        },
      });
    }
  }, [seletedCategory, deleteCategory]);

  const totalPages = categoryData?.TotalPages || 1;

  return (
    <div>
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <AnimatedReveal direction="left" delay={0.1}>
          <div className="w-fit flex flex-row gap-2">
            <Dropdown
              options={CategorySearchOptions}
              value={searchField}
              onChange={(value) => {
                setSearchField(value);
                setTimeout(() => searchInputRef.current?.focus(), 0);
              }}
            />
            <CustomInput
              ref={searchInputRef}
              placeholder={`Search by ${searchField}...`}
              value={search}
              onChange={(e: any) => setSearch(e.target.value)}
            />
          </div>
        </AnimatedReveal>

        <AnimatedReveal direction="left" delay={0.3}>
          <div className="w-fit">
            <Button
              text="Add Category"
              onClick={() => {
                setDrawerOpen(true);
                setEditCategory(null);
                setMode("add");
              }}
              bgColor="bg-lime-green"
              hoverBg="before:bg-primaryColor"
              textColor="text-white"
              hoverTextColor="group-hover:text-foreground"
              paddingx="px-4"
              paddingy="py-2"
              rounded="rounded-[5px]"
            />
          </div>
        </AnimatedReveal>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <CustomLoader />
        </div>
      ) : (
        columns.length > 0 && (
          <DataTableWrapper columns={columns} data={categoryData?.category} />
        )
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-4">
          <AdminCustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Drawer */}
      {drawerOpen && (
        <Drawer
          isOpen={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            setEditCategory(null);
            setMode("add");
          }}
          title={
            mode === "edit"
              ? "Edit Category"
              : mode === "view"
              ? "View Category"
              : "Add Category"
          }
          width="400px"
        >
          <CategoryForm
            initialData={
              singleCategoryData?.category ||
              singleCategoryData ||
              categoryData?.category?.find((c: Category) => c.id === editCategory)
            }
            onClose={() => setDrawerOpen(false)}
            mode={mode}
          />
        </Drawer>
      )}

      <ConfirmModal
        isOpen={isOpen}
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onCancel={() => setIsOpen(false)}
        title="Confirm Delete"
        message="Are you sure you want to delete this record?"
        buttonText="Delete"
      />
    </div>
  );
};

export default CategoryTable;
