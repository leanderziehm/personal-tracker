.PHONY: backend frontend database start all

backend:
	cd backend && make

frontend:
	cd frontend && make

database:
	cd database && make database

start:
	tmux new-session -d -s personal-tracker \; \
		new-window -n backend 'cd backend && ./mvnw spring-boot:run' \; \
		new-window -n frontend 'cd frontend && npm start' \; \
		new-window -n db 'cd ops && make database' \; \
		select-window -t backend \; \
		attach-session -t personal-tracker

stop:
	tmux kill-session -t personal-tracker

