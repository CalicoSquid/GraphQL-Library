/* eslint-disable react/prop-types */
export default function User({ user }) {
    return (
        <div className="user">
            <h2>Welcome {user.username}</h2>
            <p>Favorite genre: {user.favoriteGenre}</p>
        </div>
    );
}