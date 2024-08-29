import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Popup from "./Popup";

type StudentData = {
	id: number;
	name: string;
	[key: string]: string | number;
};

const initialData: StudentData[] = [
	{ id: 1, name: "Васильева Анна Игоревна", "01.09.2024": "4", "03.09.2024": "4" },
	{ id: 2, name: "Васильев Антон Васильевич", "01.09.2024": "3", "02.09.2024": "4", "03.09.2024": "5" },
	{ id: 3, name: "Алейникова Вероника Дмитриевна", "02.09.2024": "2", "03.09.2024": "Н" },
];

const dates = ["01.09.2024", "02.09.2024", "03.09.2024"];

const Table = styled.table`
	position: relative;
	width: 100%;
	border-collapse: collapse;
	margin-top: 20px;
`;

const Th = styled.th`
	border: 1px solid #ddd;
	padding: 12px;
	background-color: #3f51b5;
	color: white;
	font-weight: bold;
	text-align: center;
`;

const Td = styled.td<{ isActive: boolean }>`
	border: 1px solid #ddd;
	padding: 12px;
	text-align: center;
	cursor: pointer;
	position: ${(props) => (props.isActive ? "relative" : "static")};
	z-index: ${(props) => (props.isActive ? "1001" : "auto")};
	background-color: ${(props) => (props.isActive ? "#f9f9f9" : "white")};
	font-size: 16px;
	color: #333;

	&:hover {
		background-color: #f0f0f0;
	}
`;

const StudentTable: React.FC = () => {
	const [data, setData] = useState(initialData);
	const [popup, setPopup] = useState<{
		studentId: number;
		studentName: string;
		date: string;
		grade: string | number;
		position: { top: number; left: number };
	} | null>(null);
	const [activeCell, setActiveCell] = useState<{ studentId: number; date: string } | null>(null);
	const activeCellRef = useRef<HTMLTableCellElement | null>(null);

	const handleCellClick = (
		studentId: number,
		studentName: string,
		date: string,
		grade: string | number,
		event: React.MouseEvent<HTMLTableCellElement, MouseEvent>
	) => {
		const cell = event.currentTarget;
		const { top, left, width, height } = cell.getBoundingClientRect();
		const popupWidth = 260;

		activeCellRef.current = cell;
		setPopup({
			studentId,
			studentName,
			date,
			grade,
			position: {
				top: top + height + window.scrollY + 10,
				left: left + window.scrollX + width / 2 - popupWidth / 2,
			},
		});
		setActiveCell({ studentId, date });
	};

	const handlePopupClose = () => {
		setPopup(null);
		setActiveCell(null);
		activeCellRef.current = null;
	};

	const handleSave = (newGrade: string | number) => {
		if (popup) {
			setData((prevData) => prevData.map((student) => (student.id === popup.studentId ? { ...student, [popup.date]: newGrade } : student)));
			handlePopupClose();
		}
	};

	const adjustPosition = () => {
		if (popup && activeCellRef.current) {
			const { top, left, width, height } = activeCellRef.current.getBoundingClientRect();
			const popupWidth = 260;

			setPopup((prev) =>
				prev
					? {
							...prev,
							position: {
								top: top + height + window.scrollY + 10,
								left: left + window.scrollX + width / 2 - popupWidth / 2,
							},
					  }
					: prev
			);
		}
	};

	useEffect(() => {
		window.addEventListener("resize", adjustPosition);
		return () => {
			window.removeEventListener("resize", adjustPosition);
		};
	}, [popup]);

	return (
		<div>
			<Table>
				<thead>
					<tr>
						<Th>ФИО студента</Th>
						{dates.map((date) => (
							<Th key={date}>{date}</Th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.map((student) => (
						<tr key={student.id}>
							<Td isActive={false}>{student.name}</Td>
							{dates.map((date) => (
								<Td
									key={date}
									data-student-id={student.id}
									data-date={date}
									isActive={activeCell?.studentId === student.id && activeCell?.date === date}
									onClick={(e) => handleCellClick(student.id, student.name, date, student[date], e)}
								>
									{student[date]}
								</Td>
							))}
						</tr>
					))}
				</tbody>
			</Table>

			{popup && (
				<Popup
					top={popup.position.top}
					left={popup.position.left}
					studentName={popup.studentName}
					date={popup.date}
					grade={popup.grade}
					onSave={handleSave}
					onClose={handlePopupClose}
				/>
			)}
		</div>
	);
};

export default StudentTable;
