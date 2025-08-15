import { create } from "zustand"
import { devtools } from "zustand/middleware"

interface DialogState {
  // Dialog 상태들
  showAddDialog: boolean
  showEditDialog: boolean
  showPostDetailDialog: boolean
  showUserModal: boolean

  // Dialog Actions
  openAddDialog: () => void
  closeAddDialog: () => void
  openEditDialog: () => void
  closeEditDialog: () => void
  openPostDetailDialog: () => void
  closePostDetailDialog: () => void
  openUserModal: () => void
  closeUserModal: () => void
}

export const useDialogStore = create<DialogState>()(
  devtools(
    (set) => ({
      // 초기 상태
      showAddDialog: false,
      showEditDialog: false,
      showPostDetailDialog: false,
      showUserModal: false,

      // Dialog Actions
      openAddDialog: () => set({ showAddDialog: true }, false, "openAddDialog"),
      closeAddDialog: () => set({ showAddDialog: false }, false, "closeAddDialog"),
      openEditDialog: () => set({ showEditDialog: true }, false, "openEditDialog"),
      closeEditDialog: () => set({ showEditDialog: false }, false, "closeEditDialog"),
      openPostDetailDialog: () => set({ showPostDetailDialog: true }, false, "openPostDetailDialog"),
      closePostDetailDialog: () => set({ showPostDetailDialog: false }, false, "closePostDetailDialog"),
      openUserModal: () => set({ showUserModal: true }, false, "openUserModal"),
      closeUserModal: () => set({ showUserModal: false }, false, "closeUserModal"),
    }),
    { name: "dialog-store" },
  ),
)
