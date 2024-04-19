import React from 'react'
import DashboardListTable from './DashboardListTable'
import CreateProductForm from './CreateProductForm'

function DashboardOptionBlock({
        navItem, option, renderImportXml, renderCreateArticleForm, products, articles, users, orders,
        pages, setPaginationOffset, deleteArticle, deleteProduct, deleteUser, updateUserRole, renderPopup, setSeePostPopup, setSeeOrderPopup, popup, message, archiveOrder
    }){


    const renderBlock = () => {
        if(navItem === 'products'){
            switch (option) {
                case 'List':
                    return <DashboardListTable data={products} option={'products'} tableFields={['ID.', 'Object.ID', 'Title', 'Price', '-']} deleteProduct={deleteProduct}
                                               pages={pages} message={message} popup={popup || ''} setPaginationOffset={setPaginationOffset} />
                case 'Create':
                    return <CreateProductForm />
                case 'Import From XML':
                    return renderImportXml()
                default:
                    return null
            }

        }else if(navItem === 'articles'){
            switch (option) {
                case 'List':
                    return <DashboardListTable data={articles} option='articles' tableFields={['ID', 'Title', 'Content', 'Author', 'Post date', '-', '-', '-']} 
                                deleteArticle={deleteArticle} renderPopup={renderPopup} setSeePostPopup={setSeePostPopup}
                                popup={popup} message={message} pages={pages} setPaginationOffset={setPaginationOffset}   />
                case 'Create':
                    return renderCreateArticleForm('Create')
                default:
                    return null
            }
        
        }else if(navItem === 'users'){
            switch (option) {
                case 'List':
                    return <DashboardListTable data={users} option='users' tableFields={['Name', 'Email', 'Roles', 'Is Active', '-', '-']} 
                                pages={pages} deleteUser={deleteUser} updateUserRole={updateUserRole} setPaginationOffset={setPaginationOffset}  message={message} popup={popup || ''}   />

                default:
                    return null
            }

        }else if(navItem === 'orders'){
            switch (option) {
                case 'List':
                    return <DashboardListTable data={orders} option='orders' tableFields={['ID', 'Payment Ref', 'User', 'Status', 'Amount Payed', 'Amount To Pay', '-', '-']} 
                                pages={pages} setPaginationOffset={setPaginationOffset} archiveOrder={archiveOrder} setSeeOrderPopup={setSeeOrderPopup}  />
                case 'Archived':
                    return <DashboardListTable data={orders} option='orders' tableFields={['ID', 'Payment Ref', 'User', 'Status', 'Amount Payed', 'Amount To Pay', '-']} 
                                pages={pages} setPaginationOffset={setPaginationOffset} archiveOrder={archiveOrder} setSeeOrderPopup={setSeeOrderPopup}
                                popup={popup} message={message}   />
                default:
                    return null
            }
        }



    }

    return  renderBlock()
}

export default DashboardOptionBlock