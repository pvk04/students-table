import React from "react";
import StudentTable from "./components/StudentTable";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }
`;

const App: React.FC = () => {
	return (
		<>
			<GlobalStyle />
			<h1>Таблица оценок</h1>
			<StudentTable />
		</>
	);
};

export default App;
