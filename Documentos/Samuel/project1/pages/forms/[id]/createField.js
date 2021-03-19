import { useState } from 'react';
import styles from '../../../styles/Home.module.css'
import { callApi } from '../../../src/requestHelper';
import { Form, Button, Dropdown, Input, Select, Radio, TextArea, Checkbox } from 'semantic-ui-react';
import { FiArrowLeft } from 'react-icons/fi';
import Swal from 'sweetalert2';

export async function getServerSideProps(context) {

	const { id } = context.query;

	const res = await callApi({
		query: `
			getOneForm(client: ${id}){
				id
				client
				status
			}
		`, 
		type: 'query'
	})

	return {
		props: {
			form: res.data.getOneForm
		}, // will be passed to the page component as props
	}
}


function displayModal(){
	return(
		<div className={modalContainer}>
			
		</div>
	)
}

function CreateField(props){

	const [form, setForm] = useState(props.form);
	const [showDisplay, setShowDisplay] = useState(false);

	const boolOptions = [
		{
			key: 'true',
			text: "Sim",
			value: 'true'
		},
		{
			key: 'false',
			text: "Não",
			value: 'false'
		}
	];

	const [fieldName, setFieldName] = useState('');
	const [isRequired, setIsRequired] = useState(false);

    const createField = (e) => {
		e.preventDefault();
		callApi({
			query: `
				createAdditionalField(
					form_id: ${form.id}
					name: "${fieldName}"
					type: "text"
					required: ${isRequired}
					slug: "${form.id}"
				)
				`,
			type: 'mutation',
		}).then((response) => {
			if(response.errors && response.errors.length > 0){
				Swal.fire({
					icon: 'error',
					text: 'Algo deu errado!',
					title: 'Erro'
				})
			} else {
				Swal.fire(
					'Campo criado com sucesso!',
					'',
					'success'
				)
				window.setTimeout(() => {
					window.location = `/forms/${form.id}`},
					2000);
			}
		})
	}
	
	return(
		<div className={styles.container}>
			<div className={styles.overlay}>
				<div className={styles.createContainer}>
					<a href="/"><FiArrowLeft /></a>
					<h1>Criar Campo</h1>
					<Form onSubmit={(e) => createField(e)}>
						<Form.Field
							control={Input}
							onChange={(e, {name, value}) => setFieldName(value)}
							label='Nome do Campo'
							placeholder='Nome do Campo'
						/>
						<Form.Field
							control={Select}
							label='Obrigatório?'
							onChange={(e, {name, value}) => setIsRequired(value)}
							options={boolOptions}
							placeholder='Obrigatório?'
						/>
						<Button type="submit" fluid color='green'>Enviar</Button>
					</Form>	
				</div>
			</div>
		</div>
	)
}

export default CreateField;