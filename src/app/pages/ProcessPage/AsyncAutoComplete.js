import React, { useEffect } from 'react';
import { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios';
import { Component } from 'react';
import { Preloader, Oval } from 'react-preloader-icon';
import { faIR } from '@material-ui/core/locale';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';
import {InitialBalanceSearchAutoCompleteExceptIdsApi} from '../commonConstants/ApiConstants'
// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

export default function AsyncAutoComplete(props) {
    const [pagination, setPagination] = useState(false);
    const [changeTitle, setChangeTitle] = useState(false);
    const [hasEvent, setHasEvent] = useState(false);
    const [value, setValue] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [pages, setPages] = useState(1);
    const [totalRowNo, setTotalRowNo] = useState(0);
    const [title, setTitle] = useState('');
    const [allIdNames, setAllIdNames] = useState([]);
    const [productIdSelected,setProductSelected] = React.useState([]);

    const theme = createMuiTheme({
        direction: 'rtl',
        palette: {
            primary: {
                main: '#8950FC',
            },
            secondary: {
                main: '#8950FC',
            },
        },
    }, faIR);

    const rowInPage = 10;

    const width = props.width;

    const load = () => {
        if (loading)
            return;
        var data = {
            Title:title ,
            Page: (pages).toString(),
            Row:rowInPage.toString(),
            ids:props.selectedProductID
        }
        axios.post(InitialBalanceSearchAutoCompleteExceptIdsApi,data)
            .then(res => {
                setTotalRowNo(res.data.numberRows);
                let newArray = options;
                let newArray2 = allIdNames;
                newArray.push(...res.data.initialBalanceDtos.map(x => x.title));
                newArray2.push(...res.data.initialBalanceDtos.map((x) => {
                    return  {id : x.id , title : x.title}
                }));
                setOptions(newArray);
                setAllIdNames(newArray2);
                setLoading(false);
            });
    }
    const loadSearch = () => {
        axios.get(InitialBalanceSearchAutoCompleteExceptIdsApi+'?Title=' + title + '&Page=' + (pages).toString() + '&Row=' + rowInPage.toString())
            .then(res => {
                setTotalRowNo(res.data.numberRows);
                setOptions(res.data.initialBalanceDtos.map(x => x.title));
                setAllIdNames(res.data.initialBalanceDtos.map(x =>{
                    return {id : x.id, title: x.title}
                }));
                setLoading(false);
            });
    }

    const loadMore = () => {
        let elem = Array.from(document.getElementsByTagName('ul')).filter(x => x.getAttribute('class').includes('MuiAutocomplete-listbox'))[0];
        if (elem == undefined)
            return;

        if (elem.scrollTop + elem.offsetHeight >= elem.scrollHeight) {
            setPagination(true);
            setPages(pages => pages + 1);
        }
    }

    useEffect(() => {
        if (!pagination)
            return;
        setPagination(false);
        if (totalRowNo >= (pages - 1) * rowInPage) {
            load();
            setLoading(true);
        }
    }, [pages]);

    useEffect(() => {
        if (!changeTitle)
            return;
        setChangeTitle(false);
        setLoading(true);
        loadSearch();
    }, [title]);

    

    useEffect(() => {
        document.getElementById('preloader-' + props.id).style.marginRight = (document.getElementById(props.id).offsetWidth - 75) + 'px';
    });

    return (
        <ThemeProvider theme={theme}>
            <div dir="rtl" style={{ width: width }} id={props.id}>
                <StylesProvider jss={jss}>
                    <div style={{ width: '100%' }}>
                        <div id={'preloader-' + props.id} style={{ display: (isOpen && loading) ? 'block' : 'none', height: 0, position: 'relative', top: '7px' }}>
                            <Preloader
                                use={Oval}
                                size={20}
                                strokeWidth={8}
                                strokeColor="#8950FC"
                                duration={500}
                            />
                        </div>
                        <Autocomplete
                            value={value}
                            loading={loading}
                            fullWidth
                            onChange={(event, newValue) => {
                                setValue(newValue);
                                setChangeTitle(false);
                                if (newValue !== null && allIdNames.length > 0){
                                    props.setProductId(allIdNames.filter(x => x.title.trim() === newValue.trim())[0].id, newValue);
                                    var tmp = props.selectedProductID;
                                    tmp.push(allIdNames.filter(x => x.title.trim() === newValue.trim())[0].id)
                                    props.setSelectedProductID(tmp);
                                }
                            }}
                            inputValue={inputValue}
                            onInputChange={(event, newInputValue) => {
                                setInputValue(newInputValue);
                                setChangeTitle(true);
                                setTitle(newInputValue);
                                if (!hasEvent) {
                                    setHasEvent(true);
                                    setTimeout(() => {
                                        if (Array.from(document.getElementsByTagName('ul')).filter(x => x.getAttribute('class').includes('MuiAutocomplete-listbox'))[0] != undefined)
                                            Array.from(document.getElementsByTagName('ul')).filter(x => x.getAttribute('class').includes('MuiAutocomplete-listbox'))[0].addEventListener('scroll', loadMore);
                                    }, 1000);
                                }
                                setPagination(true);
                                setPages(1);
                            }}
                            onOpen={() => {
                                // console.log('open');
                                setIsOpen(true);
                                load();
                                setLoading(true);
                                setTimeout(() => {
                                    if (Array.from(document.getElementsByTagName('ul')).filter(x => x.getAttribute('class').includes('MuiAutocomplete-listbox'))[0] != undefined)
                                        Array.from(document.getElementsByTagName('ul')).filter(x => x.getAttribute('class').includes('MuiAutocomplete-listbox'))[0].addEventListener('scroll', loadMore);
                                }, 1000);
                            }}
                            onClose={() => {
                                setIsOpen(false);
                                setAllIdNames([]);
                                setPages(1);
                                setHasEvent(false);
                                setOptions([]);
                            }}
                            options={options}
                            renderInput={(params) => <TextField {...params} label="محصولات" variant="outlined" size='small' />}
                        />
                    </div>
                </StylesProvider>
            </div>
        </ThemeProvider>
    );
}