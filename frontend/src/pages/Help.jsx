import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink, Container,
  Flex, Tabs, TabList, TabPanels, Tab, TabPanel, Heading, Textarea, Image,
} from "@chakra-ui/react"
import React from "react";
import scenario from "../images/Scenarios.png";
import Logo from "../images/logo-simplify.png";

const Help = () => {

  window.value = 10;

  return (
      <>
        <Flex px={10} pt={2} flexDir="column" flexGrow={1}>
          <Heading>Help and FAQ</Heading>
          <Box  h={5}></Box>
          <Box backgroundColor="white" borderRadius="2xl" minH="60vh">
            <Tabs isFitted variant="enclosed">
              <TabList>
                <Tab _selected={{ color: 'white', bg: 'blue.500' }}>Introduction</Tab>
                <Tab _selected={{ color: 'white', bg: 'blue.500' }}>Scenario</Tab>
                <Tab _selected={{ color: 'white', bg: 'blue.500' }}>User Action</Tab>
                <Tab _selected={{ color: 'white', bg: 'blue.500' }}>FAQ</Tab>
              </TabList>
              <Container maxW='4xl' pt={10}>
                <Accordion defaultIndex={[1]} allowMultiple='true' allowToggle='true'>
                  <TabPanels>
                    <TabPanel>
                      <div style={{ width: '100%', height: '100%', padding: '20px' }}>
                        <p style={{ marginBottom: '20px' }}>
                          SoftDsim is a Django-based web application designed for simulating project management scenarios to be used in the Project Management module at Frankfurt University of Applied Sciences.
                          The web application SoftDSim was developed in 2022 by a student project group. It serves as a project management simulation for educational purposes. This simulation allows students to take on the role of a project manager and simulate a dynamic project management scenario. In doing so, students must make decisions to complete the scenario as successfully as possible, considering the magical project management triangle (quality, cost, time). The tool offers various actions to choose from, including adding or removing developers, setting overtime and Training, as well as assigning tasks such as solving tasks, testing, or bugfixing.
                        </p>
                        <p style={{ marginBottom: '20px' }}>
                          SoftDSim is an educational simulation designed to raise awareness among students about decision-making in project management. The scenarios in SoftDSim can only be created by professors. Students have the valuable opportunity to play these scenarios and gain an authentic insight into the work of a project manager. The main goal of the simulation is to achieve a sustainable learning effect by having noticeable effects following all actions, even if they go beyond a realistic extent. This creates a more immersive learning experience. The effects achieved include both the impacts of the simulation state that students can monitor on a dashboard, as well as the direct consequences of the actions taken by the students.</p>
                        <p style={{ marginBottom: '20px' }}>
                          For example, increased team motivation can lead to a greater number of completed tasks, while increased stress can result in more errors. It is important that the effects of the students' actions are tangible, whether it be in the form of increased stress during overtime or enhanced project familiarity through conducting meetings.</p>
                        <p style={{ marginBottom: '20px' }}>
                          Overall, SoftDSim enables students to have an interactive and realistic learning experience in the field of project management, strengthening their decision-making and problem-solving skills.</p>
                      </div>
                    </TabPanel>


                    <TabPanel>
                      <p style={{ marginBottom: '10px' }}>
                        After logging in, under the "Scenarios" section, there is an overview of the available scenarios created and published by the instructors for students to play through. A simulation can be selected and started from here. Additionally, the overview shows how many times the user has attempted a simulation ("TRIES") and the highest score achieved ("BEST SCORE") for a simulation by the user.
                      </p>
                      <Image src={scenario} w={1000} objectFit="contain" />
                      <AccordionItem>
                        <h2>
                          <AccordionButton>
                            <Box flex='1' textAlign='left'>
                              Story
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          By selecting a scenario from the overview, the "Story" of the scenario opens. The Story describes the scenario and the project's content. It contains as much information as possible about a project, aiming to make the scenario execution easier and more intuitive for the user. The Story of a simulation provides a comprehensive overview of the project and allows participants to have important information at their disposal. For example, it may outline the project prerequisites and the project management methodology to be applied. The Story helps students to better understand the context of the scenario and facilitates the identification of challenges and decisions to be made during the simulation. The "Start Simulation" button initiates the simulation. During the simulation itself, the Story remains accessible, allowing participants to refer to relevant information whenever needed. The ability to open and reread the Story during the simulation promotes a deeper understanding of the scenario, supports the learning objectives of the project management module, and facilitates achieving a good outcome within the simulation.
                        </AccordionPanel>
                      </AccordionItem>
                      <AccordionItem>
                        <h2>
                          <AccordionButton>
                            <Box flex='1' textAlign='left'>
                              Simulation
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          After starting, a new page opens for the previously selected simulation. It is divided into two main sections. On the left side, information about the current progress of the simulation is displayed. On the right side, user actions are performed. Each week, within the simulation, new inputs are required from the user on the right side of the screen. User inputs could include questions, model selection, simulation fragments, events, or results.             </AccordionPanel>
                      </AccordionItem>
                      <AccordionItem>
                        <h2>
                          <AccordionButton>
                            <Box flex='1' textAlign='left'>
                              Information about the simulation
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          The image below shows information about the current state of the simulation. After each iteration, the simulation fragments are changed or adjusted based on user inputs, and the information is updated accordingly.
                          <p>  •	Under <strong>"Open Story"</strong> in the top left corner of the image, the story of the simulation opens, describing the project.</p>
                          <p>  •	<strong>"Days until deadline"</strong> shows the number of days remaining until the project deadline. Below that, it indicates the duration of the last iteration in days.</p>
                          <p> •	<strong>"Expenses"</strong> displays the amount spent on the project in dollars. Below that, it shows the expenses of the last iteration.</p>
                          <p>  •	<strong>"Remaining Tasks"</strong> shows the number of remaining tasks. Below that, it indicates the number of tasks completed in the last iteration. If the arrow color next to the number is red instead of green, it means that additional tasks have been added through integration testing.</p>
                          <p>There is also a graphical representation of tasks, the budget and the employee status. Through the graphical display, one can see the entire project progress from the beginning to the current state.  </p>
                        </AccordionPanel>         </AccordionItem>
                      <AccordionItem>
                        <h2>
                          <AccordionButton>
                            <Box flex='1' textAlign='left'>
                              Tasks
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          "Done" refers to completed tasks in the project. Throughout the simulation, various tasks need to be completed, such as integration testing, unit testing, and bug fixing. Information about these tasks is visible in the graph. The unit tests are not counted among the “Done” tasks. Therefore, the number of unit tests is subtracted from the “Done” tasks. However, integration tests may add additional tasks, which must be completed afterwards.             </AccordionPanel>
                      </AccordionItem>
                      <AccordionItem>
                        <h2>
                          <AccordionButton>
                            <Box flex='1' textAlign='left'>
                              Budget
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          In this area the graph shows how the costs have evolved and how the costs would progress in the project if they were linear.             </AccordionPanel>
                      </AccordionItem>
                      <AccordionItem>
                        <h2>
                          <AccordionButton>
                            <Box flex='1' textAlign='left'>
                              Employee Status
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          In this area of the user interface, the average mood of the employees can be observed during the project based on three attributes. It shows the percentage of how the employees' mood develops or changes after each iteration. The better the values for each parameter throughout the simulation, the better the efficiency of the Employees and the outcome of the simulation will be in the end. Ideally, the stress value should be low, and the motivation and familiarity values should be high.
                          <p>• <strong>Stress</strong>: If the tasks are too demanding and the employees are overwhelmed, the stress value increases. The deadline is also crucial because the closer it gets, the higher the stress level becomes. However, for an ideal and efficient workflow, the stress value should not be at 0 either. An ideal stress value would be around 20. Within the simulation, it is possible to lower the stress level through stress-reducing measures. An example of this would be team meetings. Hovering the mouse over the "Team Event" field also indicates that it reduces stress.</p>
                          <p>• <strong>Motivation</strong>: The motivation value is also crucial for efficiency, as without motivation, the employees' mood decreases. Motivation is high when employees feel well-treated. For example, a team event would increase the motivation of the employees.</p>
                          <p>• <strong>Familiarity</strong>: Familiarity describes the employees' familiarity with the tasks. Familiarity is important for employees to work efficiently together in the project and complete the tasks. Familiarity increases, for example, through the scheduling of meetings.</p>
                        </AccordionPanel>
                      </AccordionItem>
                      <AccordionItem>
                        <h2>
                          <AccordionButton>
                            <Box flex='1' textAlign='left'>
                              Events
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          Events are occurrences in the simulation triggered by specific trigger points. Trigger points are defined conditions that must be met for an event to be triggered. These events can have various effects and influence the behavior of the simulation. The events in the simulation help simulate challenges that a project team may face. They can be positive or negative events. A negative event, for example, could be the addition of additional tasks due to an increased stress level. A positive event could be the reduction of some tasks due to a high familiarity value. Depending on how well or poorly a simulation is conducted, positive or negative events can occur. An example of a trigger point could be when the stress level of team members in the simulation reaches 80% or higher. Once this trigger point is reached, an event is triggered. In this case, the event could result in an increase of 20 in the number of “remaining tasks” in the simulation. This reflects increased workload and presents an additional challenge for the team. Therefore, the event serves as a warning and emphasizes the need for a lower stress level and increased attention to stress in the future.
                        </AccordionPanel>
                      </AccordionItem>
                      <AccordionItem>
                        <h2>
                          <AccordionButton>
                            <Box flex='1' textAlign='left'>
                              Result
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          At the end of a simulation, a project can be "delivered" or finished by clicking the "Finish Project" button, and after that the results are displayed. There is an option to deliver a project once 80% of the tasks have been completed. Each scenario has an end condition that must be met for the "Finish Project" button to appear. If the button does not appear and the end condition is not met, it sometimes makes more sense to manually end the project using the "Deliver" button. The results display the achieved scores for each criterion and the overall score for the project.
                          <p>• <strong>Question Score:</strong> This score refers to the questions that may arise during the project. Answering questions correctly earns points, which are displayed here.</p>
                          <p>• <strong>Budget Score:</strong> This score indicates how well the budget was adhered to. If the specified budget is exceeded, the score will be correspondingly low. The maximum score that can be achieved is 100.</p>
                          <p>• <strong>Quality Score:</strong> This score reflects the quality of the project's outcome. The score increases when thorough testing is conducted before completing the project. However, the score is negatively impacted if not all tasks are completed. The maximum score that can be achieved is 100.</p>
                          <p>• <strong>Time Score:</strong> This score relates to the adherence to the project timeline. If the deadline is not met and more time is needed for the project, the score will be relatively low. The maximum score that can be achieved is 100.</p>
                          <p>• <strong>Total Days:</strong> Here, the total number of days required for the project is displayed.</p>
                          <p>• <strong>Total Cost:</strong> Here, the costs incurred for the entire project are displayed.</p>
                          <p>• <strong>Total </strong> The scores from <strong>Question Score, Budget Score, Quality Score, and Time Score</strong> are summed up at the end to get an overall score. A percentage is calculated from the overall score and displayed as the overall result.</p>

                        </AccordionPanel>
                      </AccordionItem>
                    </TabPanel>
                    <TabPanel>
                      <p style={{ marginBottom: '10px' }}>
                        Under this section, the course of the project can change after each iteration. The settings of each fragment can be seen in the image below and can be adjusted after each iteration. After making the adjustments, clicking on "Next Week" will execute the simulation, and the new simulation results will be displayed. Furthermore, the simulation fragments allow for detailed control over various aspects of the project. By adjusting the fragment settings, different situations can be simulated, and potential impacts on the project flow and outcome can be analyzed.</p>
                      <AccordionItem>
                        <h2>
                          <AccordionButton>
                            <Box flex='1' textAlign='left'>
                              Model Selection - Project Management Method
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          At the beginning of the project, it is important to select the appropriate project management method. For the simulation, this decision is crucial as the approach varies for each method. The chosen method can influence the project flow and outcome in the simulation. There are different approaches available: Scrum, Kanban, and the Waterfall approach. Scrum and Kanban are agile methods that emphasize adaptability and engagement. Scrum is based on flexibility and active participation. It is characterized by short iterations, regular meetings, and close collaboration within the team. This iterative approach allows for changing requirements throughout the project. The high transparency and communication in Scrum enable effective collaboration.
                          On the other hand, the Waterfall approach places a strong emphasis on detailed upfront planning. Therefore, the Waterfall approach is suitable when the requirements are well-defined from the beginning. Through its structured approach, the Waterfall method allows for precise planning, clear milestones, and accurate predictability of the project's progress. Scrum and Kanban are used when the requirements may change or need to be adapted during the project.

                        </AccordionPanel>
                      </AccordionItem>
                      <AccordionItem>
                        <h2>
                          <AccordionButton>
                            <Box flex='1' textAlign='left'>
                              Employees
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          Under "Employees", staff members can be hired. There are different types of employees that can be hired. Employees with more experience can handle more tasks but are also more expensive than employees with less experience. The tasks that can be completed by the employees are divided into easy, medium and hard tasks. The error rate is higher for hard tasks than for easy tasks.
                          When selecting employees, it is important that not only one type of employee is selected. For high efficiency, it makes sense that as many different employees as possible are hired.
                          <p>
                            • <strong>Backend Developer Junior:</strong> A Junior Backend Developer assists in the development and maintenance of the server-side components of a software application under the guidance of experienced developers. They typically have less experience and require closer supervision.
                          </p>
                          <p>
                            • <strong>Backend Developer Senior:</strong> A Senior Backend Developer is responsible for developing, optimizing, and maintaining the server-side components of a software application. They possess extensive knowledge and experience and can handle complex technical challenges.
                          </p>
                          <p>
                            • <strong>Frontend Developer Junior:</strong> A Junior Frontend Developer is responsible for implementing and designing the user interface of a software application. They work closely with backend developers and usually have less experience compared to their senior counterparts.
                          </p>
                          <p>
                            • <strong>Frontend Developer Senior:</strong> A Senior Frontend Developer is responsible for designing and implementing the user interface of a software application. They have advanced knowledge of web technologies and can develop complex user interfaces.
                          </p>
                          <p>
                            • <strong>Software Tester:</strong> A Software Tester is responsible for testing and validating the developed software. They verify the functionality, quality, and performance of the application to ensure it meets the requirements.
                          </p>
                          <p>
                            • <strong>Junior Consultant:</strong> A Junior Consultant supports experienced consultants in analyzing business processes, developing solutions, and providing consulting services to clients. They are typically less experienced and work closely with Senior Consultants.
                          </p>
                          <p>
                            • <strong>Senior Consultant:</strong> A Senior Consultant is responsible for advising clients in various areas such as business process optimization, organizational development, or IT strategy. They have extensive experience, expertise, and can independently lead complex projects.
                          </p>
                          <p>
                            • <strong>Technical Specialist:</strong> A Technical Specialist is an expert in a specific technical area or technology. They provide technical expertise, assist in solving technical challenges, and advise the team on technical decisions.
                          </p>
                        </AccordionPanel>
                      </AccordionItem>
                      <AccordionItem>
                        <h2>
                          <AccordionButton>
                            <Box flex='1' textAlign='left'>
                              Bugfixing
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          In bugfixing discovered software bugs are addressed and resolved. To find bugs, unit testing must have been performed beforehand. To ensure good quality of the final result, bugs should be identified and subsequently fixed. Bugfixing is therefore important to ensure the quality of the software and provide a bug-free application. Depending on the number of bugs that need to be fixed, it is possible that in an iteration, the "remaining tasks" may not be considered at all or given less priority.
                        </AccordionPanel>
                      </AccordionItem>
                      <AccordionItem>
                        <h2>
                          <AccordionButton>
                            <Box flex='1' textAlign='left'>
                              Unit Testing
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          Unit testing is the process of testing individual units or modules to verify their functionality. These tests help to identify bugs or errors that can be addressed through bugfixing. Unit testing is also important for ensuring the quality of the software. Depending on the number of unit tests being conducted, it is possible that in an iteration, the "remaining tasks" may not be considered at all or given less priority.
                        </AccordionPanel>
                      </AccordionItem>
                      <AccordionItem>
                        <h2>
                          <AccordionButton>
                            <Box flex='1' textAlign='left'>
                              Integration Testing
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          Integration testing should ideally be conducted towards the end of the project. After performing unit testing and bug fixing, integration testing is carried out to verify if the outcome of completed tasks functions correctly within the final product. Following integration testing, there may be additional tasks added to the "remaining tasks," which will increase the number of tasks. Integration testing is also crucial for ensuring high-quality end results. Depending on the number of integration tests being conducted, it is possible that in an iteration, the "remaining tasks" may not be considered at all or given less priority.
                        </AccordionPanel>
                      </AccordionItem>
                      <AccordionItem>
                        <h2>
                          <AccordionButton>
                            <Box flex='1' textAlign='left'>
                              Model Selection - Project Management Method
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          At the beginning of the project, it is important to select the appropriate project management method. For the simulation, this decision is crucial as the approach varies for each method. The chosen method can influence the project flow and outcome in the simulation. There are different approaches available: Scrum, Kanban, and the Waterfall approach. Scrum and Kanban are agile methods that emphasize adaptability and engagement. Scrum is based on flexibility and active participation. It is characterized by short iterations, regular meetings, and close collaboration within the team. This iterative approach allows for changing requirements throughout the project. The high transparency and communication in Scrum enable effective collaboration.
                          On the other hand, the Waterfall approach places a strong emphasis on detailed upfront planning. Therefore, the Waterfall approach is suitable when the requirements are well-defined from the beginning. Through its structured approach, the Waterfall method allows for precise planning, clear milestones, and accurate predictability of the project's progress. Scrum and Kanban are used when the requirements may change or need to be adapted during the project.

                        </AccordionPanel>
                      </AccordionItem>
                      <AccordionItem>
                        <h2>
                          <AccordionButton>
                            <Box flex='1' textAlign='left'>
                              Meeting
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          Meetings are also an adjustable component in the simulation. The number of weekly meetings can be determined from week to week. Meetings provide an opportunity for team members to exchange information and ideas. They promote effective collaboration and enhance the familiarity of employees with the tasks and the project.                        </AccordionPanel>
                      </AccordionItem>
                      <AccordionItem>
                        <h2>
                          <AccordionButton>
                            <Box flex='1' textAlign='left'>
                              Team Event
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          Team events are adjustable activities in the simulation that aim to strengthen team cohesion and reduce stress. Team events can be utilized, for example, during stressful phases to lower the stress level. Their purpose is to create a positive and supportive team environment, fostering collaboration and reducing overall stress among team members.
                        </AccordionPanel>
                      </AccordionItem>
                      <AccordionItem>
                        <h2>
                          <AccordionButton>
                            <Box flex='1' textAlign='left'>
                              Training
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          Training is an adjustable component in the simulation that provides the opportunity to enhance the skills and knowledge of employees. Through training, new skills can be learned, existing abilities can be further developed, and domain expertise can be expanded. By investing in training, employees can become more proficient in their tasks, increase their productivity, and reduce the error rate associated with task completion. Training plays a crucial role in improving the overall performance and capabilities of the team members within the simulation.
                        </AccordionPanel>
                      </AccordionItem>
                      <AccordionItem>
                        <h2>
                          <AccordionButton>
                            <Box flex='1' textAlign='left'>
                              Overtime
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          The working hours of the employees can be adjusted here. The working hours have an impact on the number of tasks completed and on the level of stress. The more working hours are performed, the more tasks can be accomplished by the employees, but it also increases the level of stress.
                        </AccordionPanel>
                      </AccordionItem>
                      <AccordionItem>
                        <h2>
                          <AccordionButton>
                            <Box flex='1' textAlign='left'>
                              Questions
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          During the simulation, questions may arise to test the users' knowledge. These questions could relate to general project management topics or to the scenario itself. The progression of the simulation is not directly affected by the questions. It gives the user the opportunity to earn points by answering the questions correctly, which increases the overall score. The "Question Score" indicates the points achieved in the questions in the result.                        </AccordionPanel>
                      </AccordionItem>
                    </TabPanel>

                    <TabPanel>
                      <p style={{ marginBottom: '20px' }}>
                          <strong>How are scenarios created?</strong><br />
                          Scenarios can be created by instructors. They have admin rights and a different view where they can create and edit scenarios under "Scenario Studio". The content of scenarios is mostly based on projects from reality.
                        </p>
                      <p style={{ marginBottom: '20px' }}>
                          <strong>Which steps have to be considered when performing a scenario simulation in order to achieve a high score?</strong><br />
                          First of all, it is important to understand the content of the scenario well. During the project, one should observe the magic triangle at all times and make sure that each component is taken into account. Also, after each iteration, notice the changes in the information and in case of noticeable values, such as a high stress value, make the right adjustments for the next iteration.
                        </p>
                      <p style={{ marginBottom: '20px' }}>
                          <strong>How can I achieve a higher quality value?</strong><br />
                          For a high quality value, it is important to do a lot of testing and bug fixing. The tests must be done at the end if possible and the order in which it is done is important. Firstly, unit testing must be done to find bugs. Secondly, the bugs must be fixed. And lastly, it is important to do integration testing. This process can take place several times to achieve a high quality. Furthermore, all tasks must be completed to achieve a high-quality value.
                        </p>
                      <p style={{ marginBottom: '20px' }}>
                          <strong>Why am I not getting any bugs?</strong><br />
                          To find bugs, unit testing must have been performed beforehand.
                        </p>
                      <p style={{ marginBottom: '20px' }}>
                          <strong>How can I reduce the stress value?</strong><br />
                          Team events can be utilized during stressful phases to lower the stress level. Their purpose is to create a positive and supportive team environment, fostering collaboration and reducing overall stress among team members.
                        </p>
                      <p style={{ marginBottom: '20px' }}>
                          <strong>How can I increase the familiarity value?</strong><br />
                          Team meetings promote effective collaboration and enhance the familiarity of employees with the tasks and the project.
                        </p>
                      <p style={{ marginBottom: '20px' }}>
                          <strong>Why do I suddenly have more remaining tasks that need to be completed?</strong><br />
                          Following integration testing, there may be additional tasks added to the "remaining tasks," which will increase the number of tasks. Integration testing is also crucial for ensuring high-quality end results.
                        </p>
                      <p style={{ marginBottom: '20px' }}>
                          <strong>What happens if I answer the questions wrong?</strong><br />
                          The progression of the simulation is not directly affected by the questions. It gives the user the opportunity to earn points by answering the questions correctly, which increases the overall score.
                        </p>
                      <p style={{ marginBottom: '20px' }}>
                          <strong>How is the result determined in the end?</strong><br />
                          The scores from Question Score, Budget Score, Quality Score, and Time Score are summed up at the end, resulting in the overall score.
                        </p>
                      <p style={{ marginBottom: '20px' }}>
                          <strong>What happens if I exceed the budget?</strong><br />
                          If the specified budget is exceeded, the "Budget Score" will be correspondingly low. This will lead to a low overall score.
                        </p>
                      <p style={{ marginBottom: '20px' }}>
                          <strong>What happens if I exceed the time limit?</strong><br />
                          If the deadline is not met and more time is needed for the project, the "Time Score" will be relatively low.This will lead to a low overall score.
                        </p>
                      <p style={{ marginBottom: '20px' }}>
                          <strong>What are the differences between the employees?</strong><br />
                          The employees in the simulation differ in their roles and expertise. Each one of them brings unique skills and knowledge to the team. Seniors, for example, have more experience, cause fewer errors, and are more expensive. Juniors, for example, are much cheaper than seniors but do not have much experience and cause more errors. Software testers specialize in identifying and resolving bugs to ensure high-quality deliverables.
                        </p>
                      <p style={{ marginBottom: '20px' }}>
                          <strong>What is the best way to choose employees?</strong><br />
                          Before choosing the employees, one should understand the story of the scenario well to be able to use the right employees. The best way to choose employees would be to follow a comprehensive and balanced approach. Tasks should not be performed by only one type of employee, if possible. For high efficiency, however, as many different employees as possible should be hired.
                        </p>
                      <p style={{ marginBottom: '20px' }}>
                          <strong>How are events triggered in the simulation and what are their effects?</strong><br />
                          Events are occurrences in the simulation triggered by specific trigger points. Trigger points are defined conditions that must be met for an event to be triggered. These events can have various effects and influence the behavior of the simulation. The events in the simulation help simulate challenges that a project team may face. They can be positive or negative events. A negative event, for example, could be the addition of additional tasks due to an increased stress level. A positive event could be the reduction of some tasks due to a high familiarity value. Depending on how well or poorly a simulation is conducted, positive or negative events can occur. An example of a trigger point could be when the stress level of team members in the simulation reaches 80% or higher. Once this trigger point is reached, an event is triggered. In this case, the event could result in an increase of 20 in the number of "remaining tasks" in the simulation. This reflects increased workload and presents an additional challenge for the team. Therefore, the event serves as a warning and emphasizes the need for a lower stress level and increased attention to stress in the future.
                        </p>
                      <p style={{ marginBottom: '20px' }}>
                          <strong>How does adjusting overtime impact team productivity and stress levels?</strong><br />
                          Encouraging overtime may increase productivity in the short term, as more hours are dedicated to work. On the other hand, overtime can lead to increased stress levels and fatigue among team members, potentially impacting their long-term performance.
                        </p>
                      <p style={{ marginBottom: '20px' }}>
                          <strong>How does high stress levels affect error rates and team efficiency?</strong><br />
                          When team members experience high stress levels, their focus and concentration are compromised, leading to an increase in errors and mistakes.
                        </p>
                      <p style={{ marginBottom: '20px' }}>
                          <strong>How do decisions made during the simulation influence the final outcome and project success?</strong><br />
                          Decisions made during the simulation have a direct impact on the final outcome. Wise decision-making, based on careful consideration of available information and objectives, can lead to favorable outcomes, such as meeting project goals and delivering high-quality results.
                        </p>
                      <p style={{ marginBottom: '20px' }}>
                          <strong>How does the level of expertise of team members affect task completion time?</strong><br />
                          The level of expertise of team members has an impact on task completion time. Highly skilled (senior) team members can execute tasks more efficiently and effectively, resulting in shorter completion times and better quality.
                        </p>
                      <p style={{ marginBottom: '20px' }}>
                          <strong>How does the choice of project management methodology impact the simulation outcomes?</strong><br />
                          Different methodologies, such as Waterfall or Agile, have unique strengths and weaknesses that impact factors like task scheduling and adaptability to change. Selecting an appropriate methodology aligned with project requirements and characteristics can enhance project outcomes and efficiency.
                        </p>
                      <p style={{ marginBottom: '20px' }}>
                          <strong>How can I ensure effective communication and information sharing within the team?</strong><br />
                          Team events and meetings. Team events promote a positive team dynamic, while meetings provide focused discussions and ensure the necessary information is shared in a structured manner. Both approaches contribute to a collaborative and well-informed team environment.
                        </p>
                    </TabPanel>
                  </TabPanels>
                </Accordion>


              </Container>
            </Tabs>
          </Box>
        </Flex>
      </>
  )
}

export default Help;