import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Sabrina",
    image: "https://i.pravatar.cc/41?u=118830",
    balance: -7,
  },
  {
    id: 933372,
    name: "Ohomear",
    image: "https://i.pravatar.cc/42?u=933392",
    balance: 20,
  },
  {
    id: 499476,
    name: "Melinda",
    image: "https://i.pravatar.cc/44?u=499466",
    balance: 0,
  },
  {
    id: 493476,
    name: "Ploppy",
    image: "https://i.pravatar.cc/44?u=499262",
    balance: 20,
  },
];

function Button({ children, ...props }) {
  return (
    <button className="button" {...props}>
      {children}
    </button>
  );
}

function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleshowAddFriend() {
    return setShowAddFriend((show) => !show);
  }
  function handleselectedFriend(friend) {
    return setSelectedFriend(
      (current) => (current?.id === friend?.id ? null : friend),
      setShowAddFriend(false)
    );
  }

  function handleAddFriends(friend) {
    return (
      setFriends((friends) => [...friends, friend]), setShowAddFriend(false)
    );
  }
  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onAddSelectedFriend={handleselectedFriend}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriends} />}
        <Button onClick={handleshowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitbill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onAddSelectedFriend, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onAddSelectedFriend={onAddSelectedFriend}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onAddSelectedFriend, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          {friend.name} owes yoy {Math.abs(friend.balance)}💲
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          You owe {friend.name} {Math.abs(friend.balance)}💲
        </p>
      )}
      {friend.balance === 0 && (
        <p className="">You and {friend.name} are even</p>
      )}
      <Button onClick={() => onAddSelectedFriend(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImgage] = useState("https://i.pravatar.cc/42");

  const id = crypto.randomUUID();

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);
    setName("");
    setImgage("https://i.pravatar.cc/41");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>💃Friend name🕺</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>😎 Image URL </label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImgage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitbill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFrind = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;
    onSplitbill(whoIsPaying === "user" ? paidByFrind : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>💸 Bill Value </label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>🥷 Your expence </label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />
      <label>👩‍💻 {selectedFriend.name}'s expence</label>

      <input type="text" disabled value={paidByFrind} />
      <label>🤑 Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}
export default App;
