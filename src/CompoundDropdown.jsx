import { FiCheck, FiChevronDown } from "react-icons/fi";
import { createContext, useContext, useRef, useState } from "react";

import { FaXmark } from "react-icons/fa6";
import useClickOutside from "./useClickOutside";

const UserAssignContext = createContext();
const UserAssignDropdown = ({
  children,
  assignedList,
  setAssignedList,
  users,
}) => {
  const UserAssignDropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useClickOutside(UserAssignDropdownRef, () => {
    setIsDropdownOpen(false);
  });

  return (
    <UserAssignContext.Provider
      value={{
        assignedList,
        users,
        UserAssignDropdownRef,
        isDropdownOpen,
        setIsDropdownOpen,
        setAssignedList,
      }}>
      <div ref={UserAssignDropdownRef}>{children}</div>
    </UserAssignContext.Provider>
  );
};

const Button = ({ listStyles }) => {
  const { setIsDropdownOpen } = useContext(UserAssignContext);
  return (
    <button
      className="  px-4 py-2 flex items-center justify-between w-full rounded border border-[#828FA340] hover:border-primary cursor-pointer relative text-[#605e80]"
      onClick={() => setIsDropdownOpen(true)}>
      <span className="block">
        <FiChevronDown color="#635FC7" size={24} />
      </span>

      <UserAssignDropdown.List listStyles={listStyles} />
    </button>
  );
};

const Header = () => {
  return <label className="mt-4 mb-2 text-sm">Assign task to:</label>;
};

const ListContainer = ({ listStyles }) => {
  const { users, isDropdownOpen } = useContext(UserAssignContext);

  return (
    isDropdownOpen && (
      <ul
        className={`absolute bottom-full translate-x-9 text-white  left-full translate-y-full rounded bg-[#20212c] w-max ${listStyles}`}>
        <UserAssignDropdown.Close />
        <div className="flex flex-col p-2">
          {users?.map((user, index) => (
            <UserAssignDropdown.Item key={index} user={user} />
          ))}
        </div>
      </ul>
    )
  );
};

const Item = ({ user }) => {
  const { assignedList, setAssignedList } = useContext(UserAssignContext);

  function handleAssign(user) {
    setAssignedList((prevList) => {
      // Check if the user already exists in the list
      if (prevList.includes(user)) {
        // If user exists, remove it from the list
        const updatedList = prevList.filter((item) => item !== user);
        return updatedList;
      } else {
        // If user doesn't exist, add it to the list
        return [...prevList, user];
      }
    });
  }

  return (
    <li
      key={user.id}
      className={`flex items-center gap-2 p-4 hover:bg-[#2b2c37] rounded transition-all duration-200 `}
      onClick={() => handleAssign(user)}>
      {assignedList.includes(user) && <FiCheck />}

      <img className="w-6 h-6 " src={user.imgUrl} alt={`${user.name} image`} />
      <span>{user.name}</span>
    </li>
  );
};

const AssignedList = () => {
  const { assignedList, setAssignedList } = useContext(UserAssignContext);

  function handleRemove(id) {
    setAssignedList((assignedList) =>
      assignedList.filter((user) => user.id !== id)
    );
  }

  if (assignedList.length === 0)
    return (
      <p className="mt-4 p-2 shadow-sm bg-[#828fa318] rounded">
        No users assigned to the task yet.
      </p>
    );

  return (
    <div className="mt-4 p-2 shadow-sm bg-[#828fa318] rounded">
      <h2 className="px-2 my-3 font-bold">Assigned list:</h2>
      <div className="flex flex-wrap gap-4 ">
        {assignedList?.map((user, index) => (
          <div
            key={user.id}
            className="flex items-center gap-1 w-[47.5%] p-2 hover:bg-[#20212c] rounded transition-all duration-200"
            onClick={() => handleRemove(user.id)}>
            <span>{index + 1}.</span>
            <img
              className="w-6 h-6 "
              src={user.imgUrl}
              alt={`${user.name} image`}
            />

            <span>{user.name}</span>
            <span className="ml-auto cursor-pointer p-1 hover:bg-[#2b2c37] rounded-full">
              <FaXmark />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Close = () => {
  const { setIsDropdownOpen } = useContext(UserAssignContext);
  return (
    <div
      className="absolute top-0 right-0 flex items-center justify-center -translate-y-full gap-2 bg-[#C0392B] px-2 py-1 rounded-t"
      onClick={(e) => {
        e.stopPropagation();
        setIsDropdownOpen(false);
      }}>
      <span>Close</span>
      <span>
        <FaXmark size={20} />
      </span>
    </div>
  );
};

export default UserAssignDropdown;

UserAssignDropdown.List = ListContainer;
UserAssignDropdown.Item = Item;
UserAssignDropdown.Header = Header;
UserAssignDropdown.Button = Button;
UserAssignDropdown.AssignedList = AssignedList;
UserAssignDropdown.Close = Close;
