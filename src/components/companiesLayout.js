import React, {useState} from "react";
import {useForm} from "react-hook-form";
import 'antd/dist/antd.css';
import {DeleteOutlined} from "@ant-design/icons";
import {Button, Modal} from "antd";
import InlineEditableText from "./inlineEditableText";
import '../styles/style.css';

function generateId() {
    let res = '';
    for (let i = 0; i < 1 + Math.trunc(Math.random() * 6); i++)
        res += 1 + Math.trunc(Math.random() * 9);
    return +res;
}

function getFullDate(time) {
    const month = time.getMonth() + 1, date = time.getDate();
    return `${time.getFullYear()}-${month < 10 ? '0' + month : month}-${date < 10 ? '0' + date : date}`;
}

export default function CompaniesLayout() {
    const [state, setState] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const {register, handleSubmit} = useForm();
    const onSubmit = data => {
        data.id = generateId();
        setState([...state, data]);
    }
    return (
        <>
            <Button className={'btn-modal'} type={"primary"} onClick={() => setIsModalVisible(true)}>Добавить</Button>
            <Modal className={'add-modal'} title={'Добавление компании'} visible={isModalVisible}
                   onOk={() => setIsModalVisible(false)}
                   onCancel={() => setIsModalVisible(false)}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset className={'form-fieldset'}>
                        <label htmlFor={'title'}>Наименование</label>
                        <input id={'title'} {...register('title')}/>
                        <label htmlFor={'address'}>Адрес</label>
                        <input id={'address'} {...register('address')}/>
                        <label htmlFor={'ogrn'}>ОГРН</label>
                        <input id={'ogrn'} {...register('ogrn')}/>
                        <label htmlFor={'inn'}>ИНН</label>
                        <input id={'inn'} {...register('inn')}/>
                        <Button
                            className={'add-by-inn'}
                            type={'primary'}
                            onClick={async () => {
                                const query = document.querySelector('#inn').value;
                                const token = '76f2d19f27ce3671a38eed5aacdcdd26ca0c012f';
                                const companies = await fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party', {
                                    method: 'POST',
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Accept": "application/json",
                                        "Authorization": "Token " + token
                                    },
                                    body: JSON.stringify({query})
                                }).then(response => response.json());
                                if (!companies.suggestions.length) Modal.error({
                                    title: 'Ошибочка вышла!',
                                    content: `По данному ИНН не было найдено ни одной компании :(`
                                });
                                setState([...state, ...companies.suggestions?.map(({data, value}) => {
                                    const regDate = data.state['registration_date'], {address, ogrn, inn} = data;
                                    return {
                                        title: value,
                                        address: address.value,
                                        ogrn, inn,
                                        date: regDate ? getFullDate(new Date(regDate)) : <span>&mdash;</span>,
                                        id: generateId()
                                    }
                                })]);
                                setIsModalVisible(false);
                            }}>Загрузить</Button>
                        <label htmlFor={'date'}>Дата регистрации</label>
                        <input type={'date'} id={'date'} {...register('date')}/>
                    </fieldset>
                    <input type="submit" value={'Добавить'} onClick={() => setIsModalVisible(false)}/>
                </form>
            </Modal>
            <table className={'main-table'} border={1}>
                <thead>
                <tr>
                    <th>Наименование</th>
                    <th>Адрес</th>
                    <th>ОГРН</th>
                    <th>ИНН</th>
                    <th>Дата регистрации</th>
                </tr>
                </thead>
                <tbody>
                {
                    state?.map(({title, address, ogrn, inn, date, id}) =>
                        <tr id={id} key={id}>
                            <td>{title}</td>
                            <td>
                                <InlineEditableText text={address}/>
                            </td>
                            <td>{ogrn}</td>
                            <td>{inn}</td>
                            <td>{date}</td>
                            <td>
                                <Button
                                    className={'delete-btn'}
                                    title={'Удалить'}
                                    onClick={() => document.getElementById(`${id}`)?.remove()}>
                                    <DeleteOutlined className={'delete-bucket'}/>
                                </Button>
                            </td>
                        </tr>
                    )
                }
                </tbody>
            </table>
        </>
    );
}