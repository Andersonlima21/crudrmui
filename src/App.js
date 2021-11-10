import React, { useState, useEffect } from 'react';
import './App.css';
import MaterialTable from "material-table";
import axios from 'axios';
import {Modal, TextField, Button} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const columns= [
  { title: 'Nome', field: 'user' },
  { title: 'Email', field: 'email' },
  { title: 'Cidade', field: 'cidade' },
  { title: 'Telefone', field: 'telefone', type: 'numeric'}
];
const baseUrl="http://localhost:3001/users";


const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  icones:{
    cursor: 'pointer'
  }, 
  inputMaterial:{
    width: '100%'
  }
}));

function App() {
  const styles= useStyles();
  const [data, setData]= useState([]);
  const [modalInsert, setModalInsert]= useState(false);
  const [modalEditar, setModalEditar]= useState(false);
  const [modalEliminar, setModalEliminar]= useState(false);
  const [userSeleccionado, setUserSeleccionado]=useState({
    user: "",
    cidade: "",
    id: "",
    email: "",
    telefone: ""
  })

  const handleChange=e=>{
    const {name, value}=e.target;
    setUserSeleccionado(prevState=>({
      ...prevState,
      [name]: value
    }));
  }

  const solicitaGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
     setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }

  const solicitaPost=async()=>{
    await axios.post(baseUrl, userSeleccionado)
    .then(response=>{
      setData(data.concat(response.data));
      abrirFecharModalInsert();
    }).catch(error=>{
      console.log(error);
    })
  }

  const solicitaInsert=async()=>{
    await axios.put(baseUrl+"/"+userSeleccionado.id, userSeleccionado)
    .then(response=>{
      var novoUsuario= data;
      novoUsuario.map(user=>{
        if(user.id===userSeleccionado.id){
          user.user=userSeleccionado.user;
          user.cidade=userSeleccionado.cidade;
          user.telefone=userSeleccionado.telefone;
          user.email=userSeleccionado.email;
        }
      });
      setData(novoUsuario);
      abrirFecharModalEditar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const solicitaDelete=async()=>{
    await axios.delete(baseUrl+"/"+userSeleccionado.id)
    .then(response=>{
      setData(data.filter(user=>user.id!==userSeleccionado.id));
      abrirFecharModalEliminar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const seleccionarUser=(user, caso)=>{
    setUserSeleccionado(user);
    (caso==="Editar")?abrirFecharModalEditar()
    :
    abrirFecharModalEliminar()
  }

  const abrirFecharModalInsert=()=>{
    setModalInsert(!modalInsert);
  }

  
  const abrirFecharModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const abrirFecharModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }

  useEffect(()=>{
    solicitaGet();
  }, [])

  const bodyInsert=(
    <div className={styles.modal}>
      <h3>Adicionar Novo User</h3>
      <TextField className={styles.inputMaterial} label="Nome" name="user" onChange={handleChange}/>
      <br />
      <TextField className={styles.inputMaterial} label="Email" name="email" onChange={handleChange}/>          
<br />
<TextField className={styles.inputMaterial} label="Telefone" name="telefone" onChange={handleChange}/>
      <br />
<TextField className={styles.inputMaterial} label="Cidade" name="cidade" onChange={handleChange}/>
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={()=>solicitaPost()}>Adicionar</Button>
        <Button onClick={()=>abrirFecharModalInsert()}>Cancelar</Button>
      </div>
    </div>
  )

  const bodyEditar=(
    <div className={styles.modal}>
      <h3>Editar User</h3>
      <TextField className={styles.inputMaterial} label="Nome" name="user" onChange={handleChange} value={userSeleccionado&&userSeleccionado.user}/>
      <br />
      <TextField className={styles.inputMaterial} label="Email" name="email" onChange={handleChange} value={userSeleccionado&&userSeleccionado.email}/>          
<br />
<TextField className={styles.inputMaterial} label="Telefone" name="telefone" onChange={handleChange} value={userSeleccionado&&userSeleccionado.telefone}/>
      <br />
<TextField className={styles.inputMaterial} label="Cidade" name="cidade" onChange={handleChange} value={userSeleccionado&&userSeleccionado.cidade}/>
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={()=>solicitaInsert()}>Editar</Button>
        <Button onClick={()=>abrirFecharModalEditar()}>Cancelar</Button>
      </div>
    </div>
  )

  const bodyEliminar=(
    <div className={styles.modal}>
      <p>Deletar  <b>{userSeleccionado && userSeleccionado.user}</b>? </p>
      <div align="right">
        <Button color="secondary" onClick={()=>solicitaDelete()}>Sim</Button>
        <Button onClick={()=>abrirFecharModalEliminar()}>Não</Button>

      </div>

    </div>
  )

  return (
    <div className="App">
      <br />
      <Button onClick={()=>abrirFecharModalInsert()}>Inserir Novo User</Button>
      <br /><br />
     <MaterialTable
          columns={columns}
          data={data}
          title="Crud em React e Material Ui"  
          actions={[
            {
              icon: 'E',
              tooltip: 'Editar',
              onClick: (event, rowData) => seleccionarUser(rowData, "Editar")
            },
            {
              icon: 'D',
              tooltip: 'Deletar',
              onClick: (event, rowData) => seleccionarUser(rowData, "Eliminar")
            }
          ]}
          options={{
            actionsColumnIndex: -1,
          }}
          localization={{
            header:{
              actions: "Editar/Deletar"
            }
          }}
        />


        <Modal
        open={modalInsert}
        onClose={abrirFecharModalInsert}>
          {bodyInsert}
        </Modal>

        
        <Modal
        open={modalEditar}
        onClose={abrirFecharModalEditar}>
          {bodyEditar}
        </Modal>

        <Modal
        open={modalEliminar}
        onClose={abrirFecharModalEliminar}>
          {bodyEliminar}
        </Modal>
    </div>
  );
}

export default App;
