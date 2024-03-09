import * as AWS from 'aws-sdk';

// Configures Jest to use a longer timeout for async tests
jest.setTimeout(30000); // 30 seconds

const stateMachineArn = process.env.STATE_MACHINE_ARN;

console.log('-----------------');
console.log('stateMachineArn:', stateMachineArn);
console.log('-----------------');
test('Test step function', async () => {
    AWS.config.update({region: 'us-east-1'});

    const stepfunctions = new AWS.StepFunctions();
    const stateMachineArn = 'arn:aws:states:us-east-1:374266842493:stateMachine:MyStateMachine6C968CA5-pvNkBzSMqS8Y';
    
    async function startStateMachineExecution() {
      const params = {
        stateMachineArn: stateMachineArn,
        input: JSON.stringify({
          // Include any input your state machine needs here
        }),
        name: 'MyExecutionName-' + Date.now() // Unique execution name
      };
    
      const startResult = await stepfunctions.startExecution(params).promise();
      console.log('Execution started successfully:', startResult.executionArn);
      return startResult.executionArn; // Return the execution ARN for status checking
    }

    async function waitForExecutionToComplete(executionArn: string) {
        let status = 'RUNNING';
        while (true) { // Changed to an infinite loop
          await new Promise(resolve => setTimeout(resolve, 5000)); // 5-second delay

          const describeResult = await stepfunctions.describeExecution({executionArn}).promise();
          status = describeResult.status;
          console.log('Current execution status:', status);

          if (status === 'SUCCEEDED' || status === 'FAILED') {
            return status; // Return final status
          }
        }
        // Optionally, throw an error if the loop exits without setting the status to 'SUCCEEDED' or 'FAILED'
        throw new Error('Execution did not complete successfully.');
    }
    
    const executionArn = await startStateMachineExecution();
    const finalStatus = await waitForExecutionToComplete(executionArn);
    
    // Use Jest's expect to assert the final status
    expect(finalStatus).toBe('SUCCEEDED');
});
