import React from 'react'
import Dashboard from './Dashboard'
import Products from './Products'
import Categories from './Categories'
import OrdersPage from './OrdersPage'
import Customers from './Customers'
import InventoryDashboard from './InventoryDashboard'
import Expenses from './Expenses'
import Analytics from './Analytics'

const DashboardContainer = () => {
  return (
    <>
        <Dashboard />
        <Categories />
        <Products />
        <Customers />
        <OrdersPage />
        <InventoryDashboard />
        <Expenses />
        <Analytics />
    </>
  )
}

export default DashboardContainer