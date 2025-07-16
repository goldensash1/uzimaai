import React, { useState } from 'react';
import {
  Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, Avatar, Stack
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const initialRows = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User' },
  { id: 3, name: 'Carol Lee', email: 'carol@example.com', role: 'User' },
];

function stringAvatar(name) {
  return {
    children: name.split(' ').map(n => n[0]).join('').toUpperCase(),
  };
}

function Users() {
  const [rows, setRows] = useState(initialRows);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: '' });
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleOpen = (user = null) => {
    setEditMode(!!user);
    setSelectedUser(user);
    setForm(user ? { ...user } : { name: '', email: '', role: '' });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
    setForm({ name: '', email: '', role: '' });
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (editMode) {
      setRows(rows.map(row => row.id === selectedUser.id ? { ...form, id: row.id } : row));
    } else {
      setRows([...rows, { ...form, id: Date.now() }]);
    }
    handleClose();
  };

  const handleDeleteDialog = (user) => {
    setUserToDelete(user);
    setDeleteDialog(true);
  };

  const handleDelete = () => {
    setRows(rows.filter(row => row.id !== userToDelete.id));
    setDeleteDialog(false);
    setUserToDelete(null);
  };

  const columns = [
    {
      field: 'avatar',
      headerName: '',
      width: 60,
      renderCell: (params) => (
        <Avatar {...stringAvatar(params.row.name)} />
      ),
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'role', headerName: 'Role', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton color="primary" onClick={() => handleOpen(params.row)}><EditIcon /></IconButton>
          <IconButton color="error" onClick={() => handleDeleteDialog(params.row)}><DeleteIcon /></IconButton>
        </Stack>
      ),
      flex: 1,
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Users</Typography>
        <Button variant="contained" color="primary" startIcon={<PersonAddIcon />} onClick={() => handleOpen()}>
          Add User
        </Button>
      </Box>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} rowsPerPageOptions={[5]} autoHeight />
      </div>

      {/* Add/Edit User Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            name="name"
            value={form.name}
            onChange={handleFormChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            value={form.email}
            onChange={handleFormChange}
            fullWidth
            required
            type="email"
          />
          <TextField
            margin="dense"
            label="Role"
            name="role"
            value={form.role}
            onChange={handleFormChange}
            fullWidth
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">{editMode ? 'Save' : 'Add'}</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete {userToDelete?.name}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Users; 