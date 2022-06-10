import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer, Heading, Flex,
} from "@chakra-ui/react"
import React, { useState } from "react";

const EmployeesPanel = () => {

  const [testValues, setTestValues] = useState(
    {
      text: "Employee Overview"
    }
  )

  return (
    <>
      <Flex size='lg' fontWeight='bold' mb='2' color='black' flexFlow="column">
        <Heading size='md' fontWeight='bold' m='3'>Employees<hr></hr></Heading>
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
      </Flex>
    </>
  )
}

export default EmployeesPanel