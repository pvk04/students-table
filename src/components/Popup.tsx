import React from "react";
import styled from "styled-components";

const PopupContainer = styled.div<{ top: number; left: number }>`
	position: absolute;
	width: 260px;
	background-color: white;
	padding: 16px;
	border-radius: 8px;
	z-index: 1001;
	top: ${(props) => props.top}px;
	left: ${(props) => props.left}px;

	&::before {
		content: "";
		position: absolute;
		width: 0;
		height: 0;
		border-left: 10px solid transparent;
		border-right: 10px solid transparent;
		border-bottom: 10px solid white;
		top: -10px;
		left: 50%;
		transform: translateX(-50%);
	}
`;

const Overlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	z-index: 1000;
`;

const Button = styled.button`
	padding: 10px 20px;
	margin-top: 10px;
	font-size: 16px;
	color: white;
	background-color: #3f51b5;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	transition: background-color 0.3s ease;

	&:hover {
		background-color: #303f9f;
	}
`;

const Input = styled.input`
	width: 100%;
	padding: 8px;
	margin-top: 8px;
	font-size: 16px;
	border: 1px solid #ddd;
	border-radius: 4px;
`;

interface PopupProps {
	top: number;
	left: number;
	studentName: string;
	date: string;
	grade: string | number;
	onSave: (newGrade: string | number) => void;
	onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ top, left, studentName, date, grade, onSave, onClose }) => {
	const [newGrade, setNewGrade] = React.useState(grade);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;

		if (value === "Н") {
			setNewGrade(newGrade === "Н" ? "" : "Н");
			return;
		}

		const regex = /^[2-5]$/;
		if (regex.test(value) || value === "") {
			setNewGrade(value);
		}
	};

	return (
		<>
			<Overlay onClick={onClose} />
			<PopupContainer top={top} left={left}>
				<h3>Поставить оценку</h3>
				<p>
					<strong>Студент:</strong> {studentName}
				</p>
				<p>
					<strong>Дата:</strong> {date}
				</p>
				<div>
					<label>
						<input type="checkbox" value="Н" checked={newGrade === "Н"} onChange={handleInputChange} />
						Не присутствовал
					</label>
				</div>
				<Input value={newGrade} disabled={newGrade === "Н"} onChange={handleInputChange} />
				<Button onClick={() => onSave(newGrade)}>Сохранить</Button>
			</PopupContainer>
		</>
	);
};

export default Popup;
