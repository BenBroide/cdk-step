import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';

export class CdkStepFunctionStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkStepFunctionQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
    //
    // create aws step function resurcue 
    // Define the Lambda function
    const myFunction = new lambda.Function(this, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,    // Choose the runtime environment
      code: lambda.Code.fromAsset('src'),  // Directory with your Lambda code
      handler: 'lambda.handler'       // File and handler function
    });

    // Define a Lambda Task
    const lambdaTask = new tasks.LambdaInvoke(this, 'LambdaTask', {
      lambdaFunction: myFunction,
      outputPath: '$.Payload' // Use the output from the Lambda function
    });

    // Define the Step Function
    const definition = lambdaTask;

    const myStepFunction = new sfn.StateMachine(this, 'MyStateMachine', {
      definition,
      stateMachineType: sfn.StateMachineType.STANDARD
    });

  new cdk.CfnOutput(this, 'StateMachineArnOutput', {
    value: myStepFunction.stateMachineArn,
    exportName: 'StateMachineArn',
  });


  }
}
