% closes all figures that are currently open
close all;
% clears the command window
clc;
% clears all data from the workspace
clear;

% declare t and the the two generalized forces as symbol variables so they 
% can be subsituted later
syms t theta1(t) theta2(t) 

% Define all the constant variables of the system
L1 = 0.4;
L2 = 0.3;
m1 = 2.0;
m2 = 1.0;
g = 9.8;

% Define T1 and T2 with their given equations in terms of the theta values
% and Dtheta values
T1 = 50*(pi/4 - theta1) - 5*diff(theta1, t);
T2 = 50*(pi*sin(t)/4 - theta2) - 5*diff(theta2, t);

% Define T as the found kinetic energy of the system
T = (m1*L1^2*diff(theta1, t)^2)/6 + (m2*L1^2*diff(theta1, t)^2)/2 + ...
    (m2*L1*L2*diff(theta1, t)*diff(theta2, t)*cos(theta1-theta2))/2 + (m2*L2^2*diff(theta2, t)^2)/6;

% Define V as the potential energy of the system
V = m1*g*L1*sin(theta1)/2 + m2*g*L1*sin(theta1) + m2*g*L2*sin(theta2)/2;

% Define Lagrangian from T and V
Lagrangian = T-V;

% Using the Euler-Lagrange equation define eom1 and eom2
eom1 = simplify(diff(diff(Lagrangian, diff(theta1,t)),t)-diff(Lagrangian, theta1)) == T1 - T2;
eom2 = simplify(diff(diff(Lagrangian, diff(theta2,t)),t)-diff(Lagrangian, theta2)) == T2;

% isolate DDtheta1 and DDtheta2 using the two EOMs. This is important so
% the ODE solver can easily calculate the accleration of both angles
[newEqs,newVars] = reduceDifferentialOrder([eom1 eom2], [theta1(t) theta2(t)]);
[MM,F] = massMatrixForm(newEqs,newVars);
f = MM\F;

% set up the needed parameters for the ODE solver
% create a function that the ODE solver can use calculate the the new
% values of position and speed
odefun = odeFunction(f,newVars);
% array for time. Stores values 0 to 20 in intervals of a millisecond
time = 0:.001:20;
% all initial values are set to 0
yinit = [0 0 0 0];

% Use the ODE solver to get tout and yout of the system
[tout, yout] = ode45(odefun, time, yinit);

% create a animated line
% the maximum number of points is the number of points you want to draw.
h = animatedline('MaximumNumPoints', 3);
 
% Customize the animated figure
h.Color = 'k';
h.LineWidth = 2;
h.Marker = 'o';
h.MarkerSize = 5;
h.MarkerFaceColor = 'r';
 
% set the limits for the x and y axes of the figure
set(gca, 'XLim', [-1 1], 'YLim', [-1 1]);

% Makes sure that the aspect ratio in the x and y directions are the same
daspect([1 1 1])
 
% begins a stop watch to be used for the animation
startTime = tic;

% timeElasped stores how much time has passed
timeElapsed = toc(startTime);

% while timeElapsed is less than the ending time, repeat the follwing loop
while timeElapsed < time(end)
    
    % find the time point closest to the current elapsed time.
    [~,minI] = min(abs(time-timeElapsed));
    % add the x and y coordinates of each point in the system
    addpoints(h,...
             [0 L1*cos(yout(minI, 1)) L1*cos(yout(minI, 1))+L2*cos(yout(minI, 2))], ... %array of x coordinates
             [0 L1*sin(yout(minI, 1)) L1*sin(yout(minI, 1))+L2*sin(yout(minI, 2))]); %array of y coordinates
    % update figure
    drawnow;
    % update timeElasped
    timeElapsed = toc(startTime);
end

% after the animated figure reaches 20 seconds, the figure stops and the
% new figure containing the plot of time vs theta1 and time vs theta2
% appears

% creates the new figure
figure(2);
% plot theta1 vs time and theta2 vs time
plot(tout, yout(:,1), tout, yout(:,2));
% label the axes, create a legend for the graph, and give the graph an
% appropriate title
xlabel('time (s)');
ylabel('radians');
legend('theta1', 'theta2')
title('Theta1 and Theta2 of the system over time')

