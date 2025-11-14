"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileDropdownItemProps } from "@/src/types/web/navbar";

const MobileDropdownItem = ({
  item,
  open,
  setOpen,
  setMobileMenuOpen,
  level = 0,
}: MobileDropdownItemProps) => {
  const isDropdownOpen = open === item.label;
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <li
      className={`border-b first:border-t border-gray-200 pr-3`}
      style={{ paddingLeft: `${32 + level * 4}px` }}
    >

      {item.dropdown ? (
        <button
          className={`w-full flex justify-between font-medium text-left ${isDropdownOpen ? "text-[var(--brown)]" : "text-[var(--foreground)]"
            }`}
          onClick={() =>
            setOpen((prev) => (prev === item.label ? null : item.label))
          }
        >
          <span className="flex justify-center items-center py-3 font-bold">
            {item.label}
          </span>
          <div className="py-4 w-12 h-full border-l-2 border-[var(--gray-200)] flex justify-center items-center">
            <motion.div
              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Icon
                icon={isDropdownOpen ? "ic:baseline-minus" : "ic:baseline-plus"}
                width={18}
                height={18}
              />
            </motion.div>
          </div>
        </button>
      ) : (
        <Link
          href={item.href || "#"}
          onClick={() => setMobileMenuOpen(false)}
          className={`flex justify-between py-3 font-bold transition-colors duration-300 ${isActive ? "text-[var(--brown)]" : "text-[var(--foreground)]"
            }`}
        >
          {item.label}
        </Link>
      )}

      {/* ✅ Nested dropdowns (recursive) */}
      <AnimatePresence>
        {item.dropdown && isDropdownOpen && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mt-1 text-sm text-[var(--blue-50)]"
          >
            {item.dropdown.map((subItem, j) => {
              const subActive = pathname === subItem.href;

              return (
                <li
                  key={j}
                  className="flex flex-col border-b first:border-t border-gray-200"
                >
                  {subItem.dropdown ? (
                    // ✅ recursion for deeper levels
                    <MobileDropdownItem
                      item={subItem}
                      open={open}
                      setOpen={setOpen}
                      setMobileMenuOpen={setMobileMenuOpen}
                      level={level + 1}
                    />
                  ) : (
                    <Link
                      href={subItem.href || "#"}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`py-3 font-bold cursor-pointer transition-colors duration-300 ${subActive
                          ? "text-brown"
                          : "text-foreground"
                        }`}
                         style={{ paddingLeft: `${7 + (level + 1) * 4}px` }}
                    >
                      {subItem.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
};

export default MobileDropdownItem;
