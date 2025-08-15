import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared"
import { UserInfo } from "@/entities/users/types"

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedUser: UserInfo | null
  isLoading?: boolean
}

export const UserDialog = ({ open, onOpenChange, selectedUser, isLoading }: UserDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {isLoading && <div className="text-center text-sm text-gray-500">사용자 정보를 불러오는 중...</div>}
          {selectedUser && (
            <>
              <img src={selectedUser.image} alt={selectedUser.username} className="w-24 h-24 rounded-full mx-auto" />
              <h3 className="text-xl font-semibold text-center">{selectedUser.username}</h3>
              <div className="space-y-2">
                <p>
                  <strong>이름:</strong> {selectedUser.firstName} {selectedUser.lastName}
                </p>
                <p>
                  <strong>나이:</strong> {selectedUser.age}
                </p>
                <p>
                  <strong>이메일:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>전화번호:</strong> {selectedUser.phone}
                </p>
                <p>
                  <strong>주소:</strong> {selectedUser.address.address}, {selectedUser.address.city},{" "}
                  {selectedUser.address.state}
                </p>
                <p>
                  <strong>직장:</strong> {selectedUser.company.name} - {selectedUser.company.title}
                </p>
              </div>
            </>
          )}
          {!isLoading && !selectedUser && (
            <div className="text-center text-sm text-gray-500">사용자 정보를 찾을 수 없습니다.</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
