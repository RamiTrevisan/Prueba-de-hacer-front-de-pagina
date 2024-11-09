import { useEffect, useState } from 'react';
import { fetchAllUsers, createUser , updateUser , deleteUser  } from '../services/api';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [newUser , setNewUser ] = useState({ name: '', role: '' });
    const [editUserId, setEditUserId] = useState(null);
    const [editUserData, setEditUserData] = useState({ name: '', role: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersData = await fetchAllUsers();
                setUsers(usersData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCreateUser  = async (e) => {
        e.preventDefault();
        try {
            await createUser (newUser );
            setNewUser ({ name: '', role: '' });
            // Refrescar la lista de usuarios
            const usersData = await fetchAllUsers();
            setUsers(usersData);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEditUser  = (user) => {
        setEditUserId(user.id);
        setEditUserData({ name: user.name, role: user.role });
    };

    const handleUpdateUser  = async (e) => {
        e.preventDefault();
        try {
            await updateUser (editUserId, editUserData);
            setEditUserId(null);
            setEditUserData({ name: '', role: '' });
            // Refrescar la lista de usuarios
            const usersData = await fetchAllUsers();
            setUsers(usersData);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteUser  = async (userId) => {
        try {
            await deleteUser (userId);
            // Refrescar la lista de usuarios
            const usersData = await fetchAllUsers();
            setUsers(usersData);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Gestión de Usuarios</h1>
            <form onSubmit={handleCreateUser }>
                <h2>Crear Usuario</h2>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={newUser .name}
                    onChange={(e) => setNewUser ({ ...newUser , name: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Rol"
                    value={newUser .role}
                    onChange={(e) => setNewUser ({ ...newUser , role: e.target.value })}
                    required
                />
                <button type="submit">Crear Usuario</button>
            </form>

            {editUserId && (
                <form onSubmit={handleUpdateUser }>
                    <h2>Actualizar Usuario</h2>
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={editUserData.name}
                        onChange={(e) => setEditUserData({ ...editUserData, name: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Rol"
                        value={editUserData.role}
                        onChange={(e) => setEditUserData({ ...editUserData, role: e.target.value })}
                        required
                    />
                    <button type="submit">Actualizar Usuario</button>
                </form>
            )}

            <h2>Lista de Usuarios</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.name} - {user.role}
                        <button onClick={() => handleEditUser (user)}>Editar</button>
                        <button onClick={() => handleDeleteUser (user.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserManagement;