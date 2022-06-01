import { 
    Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,Text, Heading, } from "@chakra-ui/react"
import React, { useState } from "react";

const EmployeesPanel = () => {

    const [testValues, setTestValues] = useState(
        {
            text: "Employee Overview"
        }
    )

    return (
        <>
            <Text size='lg' fontWeight='bold' mb='2' color='black'>
                <Heading size='md' fontWeight='bold' m='3'>Employees</Heading>
                <TableContainer p='2'>
  <Table variant='striped' colorScheme='blue'>
    <TableCaption>Employees Overview</TableCaption>
    <Thead>
      <Tr>
        <Th>Position</Th>
        <Th>Salary</Th>
        <Th>Tasks done</Th>
      </Tr>
    </Thead>
    <Tbody>
      <Tr>
        <Td>Senior</Td>
        <Td>55k</Td>
        <Td>45</Td>
      </Tr>
      <Tr>
        <Td>Junior</Td>
        <Td>35k</Td>
        <Td>30</Td>
      </Tr>
      <Tr>
        <Td>Chuck Norris</Td>
        <Td>200k</Td>
        <Td>All!</Td>
      </Tr>
    </Tbody>
    
  </Table>
</TableContainer>
            </Text>
        </>
    )
}

export default EmployeesPanel