
import type {NextPage} from 'next';
import { useState } from 'react';
import { executeRequest } from '../services/api';
import { Modal } from 'react-bootstrap';


type LoginProps = {
    setAccessToken(s:string) : void
}

export const Login : NextPage<LoginProps> = ({setAccessToken}) =>{

    //Tela de login
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    //Cadastro de usuário
    const [showModal, setShowModal] = useState(false);
    const [_nameM, setNameM] = useState('');
    const [_emailM, setEmailM] = useState('');
    const [_passwordM, setPasswordM] = useState('');
    const [_errorM, setErrorM] = useState('');


    //Chama a api de login para fazer o login
    const doLogin = async() => {
        try{
            if(!email || !password){
                return setError('Favor preencher os campos.');
            }

            setLoading(true);

            const body = {
                login: email,
                password
            };

            const result = await executeRequest('login', 'POST', body);
            if(result && result.data){
               localStorage.setItem('accessToken', result.data.token);
               localStorage.setItem('name', result.data.name);
               localStorage.setItem('email', result.data.email);
               setAccessToken(result.data.token);
            }
        }catch(e : any){
            console.log('Ocorreu erro ao efetuar login:', e);
            if(e?.response?.data?.error){
                setError(e?.response?.data?.error);
            }else{
                setError('Ocorreu erro ao efetuar login, tente novamente.');
            }
        }

        setLoading(false);

    }
    //Abre o modal 
    function openModal(){
        setShowModal(true);
       
    }
    //Função que fecha o modal e limpa todos campos do modal
    function closeModal(){
        setShowModal(false);
        setErrorM("");
        setNameM("");
        setEmailM("");
        setPasswordM("");
    }

    //Cadastrar novo usuário
    const registerUser = async() => {
        try{
            //validação para verificar se nome. email e senha estejam preeenchidos
            if(!_nameM || !_emailM || !_passwordM){
                return setErrorM('Favor preencher todos os campos.');
            }
            //monta o body que será enviado para salvar o usuário
            const body = {
                name : _nameM,
                email: _emailM,
                password: _passwordM
            };
            //chama a api para salvar o novo usuário
            const result = await executeRequest('cadastro', 'POST', body);
             if(result && result.data){
               //se tudo ocorrer certo, fecho o modal de cadastro
               closeModal();

             }
        }catch(e : any){
            console.log('Ocorreu erro ao cadastrar usuário:', e);
            if(e?.response?.data?.error){
                setErrorM(e?.response?.data?.error);
            }else{
                setErrorM('Ocorreu erro ao tentar cadastrar um novo usuário, tente novamente.');
            }
        }
       
    }
    return (
        <>
        <div className='container-login'>
            <img src='/logo.svg' alt='Logo Fiap' className='logo'/>
            <div className="form">
                {error && <p className='error'>{error}</p>}
                <div>
                    <img src='/mail.svg' alt='Login'/> 
                    <input type="text" placeholder="Login" 
                        value={email} onChange={e => setEmail(e.target.value)}/>
                </div>
                <div>
                    <img src='/lock.svg' alt='Senha'/> 
                    <input type="password" placeholder="Senha" 
                        value={password} onChange={e => setPassword(e.target.value)}/>
                </div>
                <button type='button' onClick={doLogin} disabled={loading}>{loading ? '...Carregando' : 'Login'}</button>
                <div>
                    <p>Ainda não possui conta? </p>
                    <span style={{cursor:"pointer"}} onClick={openModal}>Clique aqui</span>
                    
                </div>
            </div>
        </div>
        <Modal
                show={showModal}
                className="container-modal">
                <Modal.Body>
                <p>Cadastro de usuário</p>
                <div className="form" style={{width:"80%"}}>
                    {_errorM && <p className='error'>{_errorM}</p>}
                    <div>
                        <input type="text" placeholder="Digite seu nome" 
                            value={_nameM} onChange={e => setNameM(e.target.value)}/>
                    </div>
                    <div>
                        <input type="text" placeholder="Digite seu e-mail" 
                            value={_emailM} onChange={e => setEmailM(e.target.value)}/>
                    </div>
                    <div>
                        <input type="password" placeholder="Digite sua senha" 
                            value={_passwordM} onChange={e => setPasswordM(e.target.value)}/>
                    </div>
                    <div style={{"padding-left":"5px"}}>
                        <button type='button' onClick={registerUser} > Cadastrar</button>
                        <span onClick={closeModal}>Cancelar</span>
                    </div>
                </div>
                </Modal.Body>
                <Modal.Footer>
                   
                </Modal.Footer>
            </Modal>
        </>
        
    );
}
